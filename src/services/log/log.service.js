import autoBind from "auto-bind";
import Activity from './schema/log.schema.js';
import { request, response } from "express";
import { StatusCodes } from "http-status-codes";

/**
 * Service for handling log activities.
 * 
 * This service provides methods to retrieve activities from the database.
 */
export const LogService = (() => {
    class LogService {

        #model;

        /**
         * Initializes the LogService instance.
         * 
         * Uses `auto-bind` to bind all methods to the instance.
         * Sets up the model for interacting with the activities collection.
         */
        constructor() {
            autoBind(this);
            this.#model = Activity;
        }

        /**
         * Retrieves activities by user ID.
         * 
         * Fetches a list of activities related to a specific user, sorted by timestamp in descending order.
         * 
         * @param {express.Request} req - The Express request object, containing the user ID in the route parameters.
         * @param {express.Response} res - The Express response object used to send the result or error.
         * @param {function} next - The next middleware function in the Express request-response cycle.
         * @returns {Promise<void>} - Resolves with the list of activities or an error if retrieval fails.
         * 
         * @throws {Error} If an error occurs while retrieving activities.
         */
        async getActivitiesByUserId(req = request, res = response, next) {
            try {
                const { id: userId } = req.params; // Get userId from request parameters
                const activities = await this.#model
                    .find({ userId })
                    .select('-_id -updatedAt') // Exclude _id and updatedAt fields
                    .sort({ timestamp: -1 })
                    .exec();
                res.status(StatusCodes.OK).json({ success: true, activities });
            } catch (error) {
                next(error); // Pass error to the next middleware
            }
        }

        /**
         * Retrieves all activities.
         * 
         * Fetches a list of all activities, sorted by timestamp in descending order.
         * 
         * @param {express.Request} req - The Express request object.
         * @param {express.Response} res - The Express response object used to send the result or error.
         * @param {function} next - The next middleware function in the Express request-response cycle.
         * @returns {Promise<void>} - Resolves with the list of activities or an error if retrieval fails.
         * 
         * @throws {Error} If an error occurs while retrieving activities.
         */
        async getAllActivities(req = request, res = response, next) {
            try {
                const activities = await this.#model
                    .find()
                    .select('-_id -updatedAt') // Exclude _id and updatedAt fields
                    .sort({ timestamp: -1 })
                    .exec();
                res.status(StatusCodes.OK).json({ success: true, activities });
            } catch (error) {
                next(error); // Pass error to the next middleware
            }
        }
    }

    return new LogService();
})();
