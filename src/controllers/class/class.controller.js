import { request, response } from "express";
import { models } from "../../models/index.js";
import BaseController from "../base.controller.js";
import { StatusCodes } from "http-status-codes";
import { ClassMsg } from "./class.messages.js";
import { Op } from "sequelize";
import _ from "lodash";

export const ClassController = (() => {
    /**
 * ClassController handles CRUD operations for the Class model.
 * 
 * @extends BaseController
 * @module ClassController
 */
    class ClassController extends BaseController {
        /**
         * Initializes the ClassController.
         */
        #model
        #studentModel
        constructor() {
            super();
            this.#model = models.Class; // Set the Class model from models
            this.#studentModel = models.Student; // Set the Class model from models
        }

        /**
         * Creates a new class entry in the database.
         * 
         * @async
         * @function
         * @param {Object} req - Express request object containing the class data.
         * @param {Object} res - Express response object for sending the response.
         * @param {Function} next - Express next middleware function for error handling.
         * @returns {Promise<void>}
         * 
         * @throws {Error} If an error occurs during the class creation process.
         * 
         * @example
         * // Example request body
         * {
         *   "title": "Mathematics 101",
         *   "number": 101,
         *   "capacity": 30
         * }
         */
        async createClass(req = request, res = response, next) {
            try {
                const classData = req.body;

                // Validate the classData object here if necessary
                // e.g., using a validation library like Joi or express-validator

                // Check if a class with the same number already exists
                const existingClass = await this.#model.findOne({ where: { number: classData.number } });
                if (existingClass) {
                    return res.status(StatusCodes.BAD_REQUEST).json({
                        success: false,
                        message: ClassMsg.EXISTS(classData.number),
                        errors: [{ message: ClassMsg.EXISTS(classData.number), path: "number" }]
                    });
                }

                // Create a new class entry in the database
                const newClass = await this.#model.create(classData);

                if (!newClass) {
                    return res.status(StatusCodes.BAD_REQUEST).json({
                        success: false,
                        message: ClassMsg.NOT_CREATED(),
                        errors: [{ message: ClassMsg.NOT_CREATED(), path: "create_class" }]
                    });
                }

                // Respond with the created class details
                return res.status(StatusCodes.CREATED).json({
                    success: true,
                    message: ClassMsg.CREATED(newClass.dataValues.number),
                    data: newClass
                });

            } catch (error) {
                // Pass any errors to the error-handling middleware
                return next(error);
            }
        }

        /**
         * Retrieves a class by its ID, including associated students.
         * 
         * @async
         * @function
         * @param {Object} req - Express request object containing the class ID as a URL parameter.
         * @param {Object} res - Express response object for sending the response.
         * @param {Function} next - Express next middleware function for error handling.
         * @returns {Promise<void>}
         * 
         * @throws {Error} If an error occurs while retrieving the class.
         * 
         * @example
         * // Example request URL
         * GET /classes/1
         * 
         * // Example response
         * {
         *   "success": true,
         *   "data": {
         *     "id": 1,
         *     "title": "Mathematics 101",
         *     "number": 101,
         *     "capacity": 30,
         *     "students": [
         *       {
         *         "id": 1,
         *         "first_name": "John",
         *         "last_name": "Doe",
         *         // other student fields...
         *       },
         *       // other students...
         *     ]
         *   }
         * }
         */
        async getClass(req = request, res = response, next) {
            try {
                const { id: classId } = req.params;

                // Check if the class exists with the given ID, including associated students
                const existingClass = await this.#model.findByPk(classId, {
                    include: [{
                        model: this.#studentModel,  // Include associated students
                        as: 'Students', // Ensure the alias matches the association in the Class model
                        attributes: ['id', 'national_code']
                    }]
                });

                // If the class was not found
                if (!existingClass) {
                    return res.status(StatusCodes.NOT_FOUND).json({
                        success: false,
                        message: ClassMsg.NOT_FOUND(classId),
                        errors: [{ message: ClassMsg.NOT_FOUND(classId), path: "not_found_classId" }]
                    });
                }

                // Return the class details along with associated students
                return res.status(StatusCodes.OK).json({
                    success: true,
                    data: existingClass
                });

            } catch (error) {
                // Pass any errors to the error-handling middleware
                return next(error);
            }
        }


        /**
         * Retrieves a list of classes with optional filtering, pagination, and sorting.
         * 
         * @async
         * @function
         * @param {Object} req - Express request object.
         * @param {Object} res - Express response object.
         * @param {Function} next - Express next middleware function.
         * @returns {Promise<void>}
         * 
         * @throws {Error} If there is an issue retrieving the classes.
         * 
         * 
         * @description
         * This function handles the retrieval of classes with optional filtering by title, number, and capacity.
         * Pagination is supported through the `page` and `limit` query parameters.
         * Sorting can be done by `capacity` and `number` in ascending or descending order.
         */
        async getClasses(req = request, res = response, next) {
            try {
                const { page = 1, limit = 10, title, number, capacity, sortByCapacity, sortByNumber } = req.query;

                // Validate and parse query parameters
                const parsedPage = parseInt(page, 10);
                const parsedLimit = parseInt(limit, 10);
                const parsedNumber = number ? parseInt(number, 10) : undefined;
                const parsedCapacity = capacity ? parseInt(capacity, 10) : undefined;

                if (isNaN(parsedPage) || isNaN(parsedLimit) || (number && isNaN(parsedNumber)) || (capacity && isNaN(parsedCapacity))) {
                    return res.status(StatusCodes.BAD_REQUEST).json({
                        success: false,
                        message: "Invalid query parameters",
                        errors: [{ message: "Invalid query parameters", path: "query_parameters" }]
                    });
                }

                const where = {};
                if (title) {
                    where.title = title;
                }
                if (number) {
                    where.number = parsedNumber;
                }
                if (capacity) {
                    where.capacity = parsedCapacity;
                }

                const offset = (parsedPage - 1) * parsedLimit;

                // Determine sort options
                const order = [];
                if (sortByCapacity) {
                    // Sorting by capacity (ascending or descending)
                    order.push(['capacity', sortByCapacity.toUpperCase()]);
                }
                if (sortByNumber) {
                    // Sorting by number (ascending or descending)
                    order.push(['number', sortByNumber.toUpperCase()]);
                }

                const { count, rows: classes } = await this.#model.findAndCountAll({
                    where,
                    attributes: {
                        exclude: ['createdAt', 'updatedAt']
                    },
                    include: [{
                        model: this.#studentModel,
                        as: 'Students',
                        attributes: ['id', 'national_code']
                    }],
                    limit: parsedLimit,
                    offset: offset,
                    order,
                });

                res.status(StatusCodes.OK).json({
                    success: true,
                    classes,
                    pagination: {
                        total: count,
                        page: parsedPage,
                        limit: parsedLimit,
                        totalPages: Math.ceil(count / parsedLimit)
                    }
                });
            } catch (error) {
                next(error);
            }
        }



        /**
         * Updates a class's title and number by its ID.
         * 
         * @async
         * @function
         * @param {Object} req - Express request object.
         * @param {Object} res - Express response object.
         * @param {Function} next - Express next middleware function.
         * @returns {Promise<void>}
         * 
         * @throws {Error} If there is an issue updating the class.
         * 
         * @description
         * This function handles the update of a class's title and number. 
         * It ensures that the number provided for the class is unique. 
         * If another class with the same number already exists, an appropriate error message is returned.
         */
        async updateClass(req = request, res = response, next) {
            try {
                const { id: classId } = req.params;
                const updatedData = _.omitBy(req.body, (value, key) => _.isNil(value) || value === '' || key === 'capacity');

                // Check if the class exists with the given ID
                const existingClass = await this.#model.findByPk(classId);

                // If the class was not found
                if (!existingClass) {
                    return res.status(StatusCodes.NOT_FOUND).json({
                        success: false,
                        message: ClassMsg.NOT_FOUND(classId),
                        errors: [{ message: ClassMsg.NOT_FOUND(classId), path: 'not_found_classId' }]
                    });
                }

                // Check if the new number is taken by another class
                if (updatedData.number) {
                    const conflictingClass = await this.#model.findOne({ where: { number: updatedData.number } });

                    if (conflictingClass && conflictingClass.id !== classId) {
                        return res.status(StatusCodes.BAD_REQUEST).json({
                            success: false,
                            message: ClassMsg.NUMBER_CONFLICT(updatedData.number),
                            errors: [{ message: ClassMsg.NUMBER_CONFLICT(updatedData.number), path: 'number_conflict' }]
                        });
                    }
                }

                // Update the class with the new data
                await existingClass.update(updatedData);
                await existingClass.save();

                res.status(StatusCodes.OK).json({
                    success: true,
                    message: ClassMsg.UPDATED(classId),
                    class: existingClass
                });
            } catch (error) {
                next(error);
            }
        }



        /**
         * Deletes a class by its ID.
         * 
         * @async
         * @function
         * @param {Object} req - Express request object.
         * @param {Object} res - Express response object.
         * @param {Function} next - Express next middleware function.
         * @returns {Promise<void>}
         * 
         * @throws {Error} If there is an issue deleting the class.
         * 
         * @description
         * This function handles the deletion of a class identified by its ID. 
         * If the class is found and successfully deleted, a success message is returned. 
         * If the class is not found, a `404 Not Found` response is returned.
         */
        async deleteClass(req = request, res = response, next) {
            try {
                const { id: classId } = req.params;

                // Check if the class exists with the given ID
                const existingClass = await this.#model.findByPk(classId);

                // If the class was not found
                if (!existingClass) {
                    return res.status(StatusCodes.NOT_FOUND).json({
                        success: false,
                        message: ClassMsg.NOT_FOUND(classId),
                        errors: [{ message: ClassMsg.NOT_FOUND(classId), path: 'not_found_classId' }]
                    });
                }

                // Delete the class
                await existingClass.destroy();

                res.status(StatusCodes.OK).json({
                    success: true,
                    message: ClassMsg.DELETED(classId)
                });
            } catch (error) {
                next(error);
            }
        }
    }

    return new ClassController()
})()


