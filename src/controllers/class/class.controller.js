import { request, response } from "express";
import { models } from "../../models/index.js";
import BaseController from "../base.controller.js";
import { StatusCodes } from "http-status-codes";
import { ClassMsg } from "./class.messages.js";

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

    }

    return new ClassController()
})()


