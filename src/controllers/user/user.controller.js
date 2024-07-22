import { request, response } from 'express';
import { models } from '../../models/index.js';
import _ from 'lodash';
import { StatusCodes } from 'http-status-codes';
import { UserMsg } from './user.messages.js';

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
    }

    return new UserController();
})();
