'use strict'

import autoBind from "auto-bind"
import { models } from "../../models/index.js"
import { request, response } from "express"
import { StatusCodes } from "http-status-codes"
import { FieldMsg } from "./field.messages.js"
import { sequelize } from "../../configs/database.conf.js"

export const FieldController = (() => {
    class FieldController {
        /**
         * Private property that holds the Field model.
         * @private
         * @type {Object}
         */
        #model;

        /**
         * Private property that holds the Image model.
         * @private
         * @type {Object}
         */
        #imageModel;

        /**
         * Constructs an instance of the class and initializes the model properties.
         * 
         * @constructor
         * @param {Object} models - An object containing the initialized database models.
         * @param {Object} models.User - The User model.
         * @param {Object} models.Image - The Image model.
         * @param {Object} models.Field - The Field model.
         * @param {Object} models.Student - The Student model.
         * 
         * @example
         * const instance = new YourClassName(models);
         */
        constructor() {
            autoBind(this); // Automatically bind class methods to the instance
            this.#model = models.Field; // Initialize the #model property with the Field model
            this.#imageModel = models.Image; // Initialize the #imageModel property with the Image model
        }



        /**
         * Creates a new field in the database with the provided data.
         * 
         * @async
         * @function createField
         * @param {Object} req - The request object, which contains the field data in the body and any uploaded files.
         * @param {Object} res - The response object, used to send back the desired HTTP response.
         * @param {Function} next - The next middleware function in the Express.js request-response cycle.
         * 
         * @throws {Error} If an error occurs during the database operations, it will be passed to the next middleware.
         * 
         * @returns {Promise<void>} Sends a JSON response with the created field data or an error message.
         * 
         * @example
         * // Example usage in an Express route
         * app.post('/fields', createField);
         */
        async createField(req = request, res = response, next) {
            let transaction;
            try {
                const fieldData = req.body; // Extract field data from the request body

                // Start a transaction to ensure atomicity
                transaction = await sequelize.transaction();

                // Check for uniqueness of title and grade
                const existingField = await this.#model.findOne({
                    where: {
                        title: fieldData.title, // Check for existing field with the same title
                        grade: fieldData.grade   // Check for existing field with the same grade
                    },
                    transaction
                });

                // If a field with the same title and grade exists, rollback and return an error
                if (existingField) {
                    await transaction.rollback();
                    return res.status(StatusCodes.BAD_REQUEST).json({
                        success: false,
                        message: 'A field with the same title and grade already exists',
                        errors: [
                            {
                                message: 'A field with this title and grade already exists',
                                path: ['title', 'grade']
                            }
                        ]
                    });
                }

                // Create a new field in the database
                const field = await this.#model.create(fieldData, { transaction });

                // If field creation fails, rollback and return an error
                if (!field) {
                    await transaction.rollback();
                    return res.status(StatusCodes.BAD_REQUEST).json({
                        success: false,
                        message: 'Field creation failed',
                        errors: []
                    });
                }

                // Check if files are uploaded and process them
                if (req.files && req.files.length > 0) {
                    for (const file of req.files) {
                        const { path: filePath } = file;

                        // Save each image and associate it with the field
                        const image = await this.#imageModel.create({
                            title: `field-pic-${field.id}`, // Generate a title for the image
                            url: filePath.replace(process.cwd() + '/public', ''), // Store the image URL
                            imageableId: field.id, // Associate the image with the field
                            imageableType: 'field'  // Specify the type of association
                        }, { transaction });

                        // Associate each image with the field
                        await field.setFieldPicture(image, { transaction });
                    }
                }

                // Commit the transaction if everything is successful
                await transaction.commit();

                // Respond with the created field data
                return res.status(StatusCodes.CREATED).json({
                    success: true,
                    message: FieldMsg.CREATED(field.dataValues.title, field.dataValues.grade), // Custom success message
                    field // Return the created field
                });
            } catch (error) {
                // Rollback the transaction in case of an error
                if (transaction) {
                    await transaction.rollback();
                }
                next(error); // Pass the error to the next middleware
            }
        }


        /**
         * Retrieves a list of fields from the database based on optional query parameters.
         * 
         * @async
         * @function getFields
         * @param {Object} req - The request object, which contains query parameters for filtering fields.
         * @param {Object} res - The response object, used to send back the desired HTTP response.
         * @param {Function} next - The next middleware function in the Express.js request-response cycle.
         * 
         * @throws {Error} If an error occurs during the database query, it will be passed to the next middleware.
         * 
         * @returns {Promise<void>} Sends a JSON response with the list of fields.
         * 
         * @example
         * // Example usage in an Express route
         * app.get('/fields', getFields);
         */
        async getFields(req = request, res = response, next) {
            try {
                // Extract query parameters with default values
                const {
                    limit = 10, // Default limit for the number of fields to retrieve
                    offset = 0, // Default offset for pagination
                    title,      // Optional filter by title
                    grade,      // Optional filter by grade
                } = req.query;

                // Prepare filter conditions based on query parameters
                const whereConditions = {};

                if (title) {
                    whereConditions.title = title; // Add title filter if provided
                }
                if (grade) {
                    whereConditions.grade = grade; // Add grade filter if provided
                }

                // Query the database for fields with the specified conditions
                const fields = await this.#model.findAll({
                    where: whereConditions, // Apply filter conditions
                    limit: parseInt(limit, 10), // Limit the number of results
                    offset: parseInt(offset, 10), // Set the starting point for results
                    attributes: {
                        exclude: ["createdAt", "updatedAt"] // Exclude timestamps from the response
                    },
                    include: [
                        {
                            model: this.#imageModel, // Include associated image model
                            as: 'fieldPicture', // Alias for the associated model
                            attributes: ['url'] // Only include the URL attribute of the image
                        }
                    ]
                });

                // Send a 200 OK response with the retrieved fields
                res.status(StatusCodes.OK).json({
                    success: true,
                    fields // Return the list of found fields
                });
            } catch (error) {
                // If an error occurs, pass it to the next middleware for handling
                next(error);
            }
        }


        /**
         * Retrieves a field from the database based on the provided field ID.
         * 
         * @async
         * @function getField
         * @param {Object} req - The request object, which contains the parameters for the request.
         * @param {Object} res - The response object, used to send back the desired HTTP response.
         * @param {Function} next - The next middleware function in the Express.js request-response cycle.
         * 
         * @throws {Error} If an error occurs during the database query, it will be passed to the next middleware.
         * 
         * @returns {Promise<void>} Sends a JSON response with the field data or an error message.
         * 
         * @example
         * // Example usage in an Express route
         * app.get('/fields/:id', getField);
         */
        async getField(req = request, res = response, next) {
            try {
                // Extract the field ID from the request parameters
                const { id: fieldId } = req.params;

                // Query the database for the field with the specified ID
                const field = await this.#model.findByPk(fieldId, {
                    attributes: {
                        exclude: ['createdAt', 'updatedAt'] // Exclude timestamps from the response
                    },
                    include: [
                        {
                            model: this.#imageModel, // Include associated image model
                            as: 'fieldPicture', // Alias for the associated model
                            attributes: ['url'] // Only include the URL attribute of the image
                        }
                    ]
                });

                // If the field is not found, send a 404 Not Found response
                if (!field) {
                    res.status(StatusCodes.NOT_FOUND).json({
                        success: false,
                        message: FieldMsg.NOT_FOUND(fieldId) // Custom message for field not found
                    });
                    return; // Exit the function after sending the response
                }

                // If the field is found, send a 200 OK response with the field data
                res.status(StatusCodes.OK).json({
                    success: true,
                    field // Return the found field
                });
            } catch (error) {
                // If an error occurs, pass it to the next middleware for handling
                next(error);
            }
        }

    }
    return new FieldController()
})()