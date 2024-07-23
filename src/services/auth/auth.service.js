import autoBind from "auto-bind"
import { models } from "../../models/index.js"
import { request, response } from "express"
import { StatusCodes } from "http-status-codes"
import { Op } from 'sequelize';
import { AuthMsg } from "./auth.messages.js";
import { generateOTP } from "../../utils/otp-generator.js";
import { generateToken } from "../../utils/token-generator.js";
import logger from "../log/log.module.js"


export const AuthService = (() => {
    class AuthService {
        #model;
        #logger;

        constructor() {
            autoBind(this);
            this.#model = models.User;
            this.#logger = logger
        }

        /**
         * Registers a new user.
         *
         * @async
         * @param {Object} req - The request object containing user data.
         * @param {Object} res - The response object.
         * @param {Function} next - The next middleware function.
         */
        async register(req = request, res = response, next) {
            try {
                const { username, email, phone, password } = req.body;

                // Check if user already exists
                const existingUser = await this.#model.findOne({
                    where: {
                        [Op.or]: [{ username }, { email }, { phone }],
                    },
                });

                if (existingUser) {
                    return res.status(StatusCodes.BAD_REQUEST)
                        .json({
                            success: false,
                            message: AuthMsg().USER_EXIST
                        });
                }

                const otp = generateOTP();
                const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

                const user = await this.#model.create({ username, email, phone, password, otp, otpExpiry });

                await this.#logger.logActivity(user.id, AuthMsg().REGISTERED, {
                    user: user.dataValues.username
                })

                // await sendEmail(email, 'Your OTP Code', `Your OTP code is ${otp}`);

                res.status(StatusCodes.CREATED)
                    .json({
                        success: true,
                        message: AuthMsg().REGISTERED,
                        otp
                    });
            } catch (error) {
                next(error);
            }
        }

        /**
         * Verifies the OTP for a user.
         *
         * @async
         * @param {Object} req - The request object containing phone and OTP.
         * @param {Object} res - The response object.
         * @param {Function} next - The next middleware function.
         */
        async verifyOTP(req = request, res = response, next) {
            try {
                const { phone, otp } = req.body;
                const user = await this.#model.findOne({ where: { phone, otp } });

                if (!user || user.otpExpiry < new Date()) {
                    return res.status(StatusCodes.BAD_REQUEST).json({
                        success: false,
                        message: AuthMsg().OTP_EXPIRED
                    });
                }

                await this.#logger.logActivity(user.id, AuthMsg().VERIFIES_TOKEN, {
                    user: user.dataValues.username,
                    otp: user.otp,
                    otpExpiry: user.otpExpiry,
                })

                user.otp = null;
                user.otpExpiry = null;
                await user.save();

                const token = generateToken(user);



                res.status(StatusCodes.OK)
                    .json({
                        success: true,
                        token
                    });
            } catch (error) {
                next(error);
            }
        }

        /**
         * Logs in a user.
         *
         * @async
         * @param {Object} req - The request object containing username and password.
         * @param {Object} res - The response object.
         * @param {Function} next - The next middleware function.
         */
        async login(req = request, res = response, next) {
            try {
                const { username, password } = req.body;
                const user = await this.#model.findOne({ where: { username } });

                if (!user || !(await user.comparePassword(password))) {
                    return res.status(StatusCodes.UNAUTHORIZED)
                        .json({
                            success: false,
                            message: AuthMsg().UNAUTHORIZED
                        });
                }
                await this.#logger.logActivity(user.id, AuthMsg().LOGGED_IN, {
                    user: user.dataValues.username
                })

                const token = generateToken(user);
                res.status(StatusCodes.OK).json({
                    success: true,
                    token
                });
            } catch (error) {
                next(error);
            }
        }
    }

    return new AuthService();
})();
