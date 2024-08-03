import autoBind from 'auto-bind';
import { request, response } from 'express';
import createHttpError from 'http-errors';
import { StatusCodes } from 'http-status-codes';
import _ from 'lodash';
import path from 'path';
import { Op } from 'sequelize';
import { models } from '../../models/index.js';
import logger from '../../services/log/log.module.js';
import { UserMsg } from './user.messages.js';

/**
 * @module UserController
 * @description Controller for managing user-related operations.
 */
export const UserController = (() => {
  class UserController {
    #model;
    #logger;

    /**
     * Creates an instance of UserController.
     * @constructor
     */
    constructor() {
      autoBind(this);
      this.#model = models.User;
      this.#logger = logger;
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
        const userData = _.omitBy(
          { username, email, phone, password },
          _.isNil
        );

        // Use the custom createUser method to handle user creation
        const user = await this.#model.create(userData);

        await this.#logger.logActivity(
          req?.user?.id,
          UserMsg(username).CREATED,
          {
            user: username,
          }
        );
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
            exclude: ['password', 'createdAt', 'updatedAt'],
          },
          include: [
            {
              model: models.Image,
              as: 'profilePicture',
              where: { imageableType: 'user' },
              attributes: ['url'],
              required: false,
            },
          ],
        });

        // Check if the user exists
        if (!user) {
          await this.#logger.logActivity(
            req?.user?.id,
            `tried to get user with id: ${userId}`,
            {
              user_id: userId,
            }
          );
          throw new createHttpError.NotFound(UserMsg().NOT_FOUND);
        }

        // Format the URL to be accessible from the public folder
        if (user.profilePicture && user.profilePicture.url) {
          // Strip '/public' from the URL
          user.profilePicture.url = user.profilePicture.url.replace(
            path.join(process.cwd(), 'public'),
            ''
          );
        }

        await this.#logger.logActivity(
          user.id,
          UserMsg(user.dataValues.username).FETCHED,
          {
            user: user.dataValues.username,
          }
        );
        // Respond with the user data
        res.status(StatusCodes.OK).json({
          success: true,
          user,
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
            exclude: ['password', 'createdAt', 'updatedAt'],
          },
          limit: parseInt(limit, 10),
          offset: parseInt(offset, 10),
          where: whereClause,
          include: [
            {
              model: models.Image,
              as: 'profilePicture',
              where: { imageableType: 'user' },
              attributes: ['url'],
              required: false,
            },
          ],
        };

        const users = await this.#model.findAndCountAll(options);

        // Format the URLs to be accessible from the public folder
        users.rows.forEach((user) => {
          if (user.profilePicture && user.profilePicture.url) {
            user.profilePicture.url = user.profilePicture.url.replace(
              path.join(process.cwd(), 'public'),
              ''
            );
          }
        });

        res.status(StatusCodes.OK).json({
          success: true,
          total: users.count,
          pages: Math.ceil(users.count / limit),
          users: users.rows,
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
        const userData = _.omitBy(
          req.body,
          (value) => _.isNil(value) || value === ''
        );

        const user = await this.#model.findByPk(userId);

        if (!user) {
          throw new createHttpError.NotFound(UserMsg().NOT_FOUND);
        }

        const updatedFields = {};
        for (const key of Object.keys(userData)) {
          if (user[key] !== userData[key]) {
            updatedFields[key] = `Updated ${key} to ${userData[key]}`;
          }
        }

        await user.update(userData);

        res.status(StatusCodes.OK).json({
          success: true,
          message: UserMsg(user.username).UPDATED,
          updatedFields: updatedFields,
          user: _.omit(user.dataValues, ['password', 'createdAt', 'updatedAt']),
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
