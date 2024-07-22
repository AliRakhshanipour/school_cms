import { request, response } from 'express';
import { models } from '../../models/index.js';
import _ from 'lodash';
import { StatusCodes } from 'http-status-codes';
import { UserMsg } from './user.messages.js';
import createHttpError from 'http-errors';

/**
 * @module UserController
 * @description Controller for managing user-related operations.
 */
export const UserController = (() => {
    class UserController {
        #model;

        /**
         * Creates an instance of UserController.
         * @constructor
         */
        constructor() {
            this.#model = models.User;
        }

        /**
         * Creates a new user.
         * 
         * @async
         * @param {Object} req - The request object containing user data.
         * @param {Object} res - The response object used to send the response.
         * @param {Function} next - The next middleware function to pass control.
         * @returns {Promise<void>} - A promise that resolves when the operation is complete.
         */
        async create(req = request, res = response, next) {
            try {
                // Destructure the required fields from the request body
                const { username, email, phone, password } = req.body;

                // Create user object, omitting fields if they are null or undefined
                const userData = _.omitBy({ username, email, phone, password }, _.isNil);

                // Use the custom createUser method to handle user creation
                const user = await this.#model.createUser(userData);

                // Respond with the created user information
                res.status(StatusCodes.CREATED).json({
                    success: true,
                    message: UserMsg(username).CREATED,

                });
            } catch (error) {
                // Pass errors to the error-handling middleware
                next(error);
            }
        }


        /**
         * Fetches a user by ID.
         * 
         * @async
         * @param {Object} req - The request object.
         * @param {Object} res - The response object.
         * @param {Function} next - The next middleware function.
         * @returns {Promise<void>}
         */
        async get(req = request, res = response, next) {
            try {
                const { id: userId } = req.params;

                // Fetch the user by primary key
                const user = await this.#model.findByPk(userId, {
                    attributes: {
                        exclude: ["createdAt", "updatedAt"]
                    }
                });

                // Check if the user exists
                if (!user) {
                    throw new createHttpError.NotFound(UserMsg().NOT_FOUND);
                }

                // Respond with the user data
                res.status(StatusCodes.OK).json({
                    success: true,
                    user
                });

            } catch (error) {
                // Pass errors to the error-handling middleware
                next(error);
            }
        }

        /**
         * Fetches all users with optional pagination and filtering.
         * 
         * @async
         * @param {Object} req - The request object.
         * @param {Object} res - The response object.
         * @param {Function} next - The next middleware function.
         * @returns {Promise<void>}
         */
        async getUsers(req = request, res = response, next) {
            try {
                const { page = 1, limit = 10, username = '', role = '' } = req.query;
                const offset = (page - 1) * limit;

                const whereClause = {};
                if (username) {
                    whereClause.username = { [Op.like]: `%${username}%` };
                }
                if (role) {
                    whereClause.role = role;
                }

                const options = {
                    attributes: {
                        exclude: ["createdAt", "updatedAt"]
                    },
                    limit: parseInt(limit, 10),
                    offset: parseInt(offset, 10),
                    where: whereClause
                };

                const users = await this.#model.findAndCountAll(options);

                res.status(StatusCodes.OK).json({
                    success: true,
                    total: users.count,
                    pages: Math.ceil(users.count / limit),
                    users: users.rows
                });
            } catch (error) {
                next(error);
            }
        }


        /**
         * Updates an existing user.
         * 
         * @async
         * @param {Object} req - The request object.
         * @param {Object} res - The response object.
         * @param {Function} next - The next middleware function.
         * @returns {Promise<void>}
         */
        async update(req = request, res = response, next) {
            try {
                const { id: userId } = req.params;
                const userData = _.omitBy(req.body, _.isNil);

                const user = await this.#model.findByPk(userId);

                if (!user) {
                    throw new createHttpError.NotFound(UserMsg().NOT_FOUND);
                }

                await user.update(userData);

                res.status(StatusCodes.OK).json({
                    success: true,
                    message: UserMsg(user.username).UPDATED,
                    user: _.omit(user.dataValues, ['password', 'createdAt', 'updatedAt'])
                });
            } catch (error) {
                next(error);
            }
        }


        /**
         * Deletes an existing user.
         * 
         * @async
         * @param {Object} req - The request object.
         * @param {Object} res - The response object.
         * @param {Function} next - The next middleware function.
         * @returns {Promise<void>}
         */
        async delete(req = request, res = response, next) {
            try {
                const { id: userId } = req.params;
                const user = await this.#model.findByPk(userId);

                if (!user) {
                    throw new createHttpError.NotFound(UserMsg().NOT_FOUND);
                }

                await user.destroy();

                res.status(StatusCodes.NO_CONTENT).end();
            } catch (error) {
                next(error);
            }
        }
    }

    return new UserController();
})();