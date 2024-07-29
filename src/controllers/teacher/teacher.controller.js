import autoBind from 'auto-bind';
import { models } from '../../models/index.js';
import { request, response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { TeacherMsg } from './teacher.messages.js';
import { sequelize } from '../../configs/database.conf.js';
import { Op } from 'sequelize';
import fs from 'fs';
import path from 'path'
import _ from 'lodash';

export const TeacherController = (() => {
    class TeacherController {
        #model
        #imageModel
        constructor() {
            autoBind(this);
            this.#model = models.Teacher;
            this.#imageModel = models.Image;
        }

        /**
         * Creates a new teacher record in the database.
         * 
         * This asynchronous method handles the creation of a teacher by:
         * 1. Validating if a teacher with the same personal code already exists.
         * 2. Creating a new teacher record if no existing record is found.
         * 3. Optionally processing an uploaded file (e.g., an image) and associating it with the newly created teacher.
         * 
         * @param {Object} req - The request object, which contains the body with teacher data and any uploaded files.
         * @param {Object} res - The response object, used to send back the desired HTTP response.
         * @param {Function} next - The next middleware function in the stack, used for error handling.
         * 
         * @returns {Promise<void>} - Returns a promise that resolves when the operation is complete.
         * 
         * @throws {Error} - If an error occurs during the process, it will be passed to the next middleware for handling.
         */
        async createTeacher(req = request, res = response, next) {
            const transaction = await sequelize.transaction(); // Start a transaction
            try {
                // Extract teacher data from the request body
                const teacherData = req.body;

                // Check if a teacher with the same personal code already exists
                const existingTeacher = await this.#model.findOne({
                    where: { personal_code: teacherData?.personal_code },
                    transaction // Pass the transaction
                });

                // If a teacher with the same personal code exists, return a bad request response
                if (existingTeacher) {
                    res.status(StatusCodes.BAD_REQUEST).json({
                        success: false,
                        message: TeacherMsg.UNIQUE_PERSONAL_CODE()
                    });
                    return; // Exit the function to prevent further execution
                }

                // Create a new teacher record in the database
                const teacher = await this.#model.create(teacherData, { transaction }); // Pass the transaction

                // If the teacher record was not created successfully, return a bad request response
                if (!teacher) {
                    res.status(StatusCodes.BAD_REQUEST).json({
                        success: false,
                        message: TeacherMsg.NOT_CREATED()
                    });
                    return; // Exit the function to prevent further execution
                }

                // Check if a file is uploaded and process it
                if (req.file) {
                    const { path: filePath } = req.file;

                    // Save the image and associate it with the teacher
                    const image = await this.#imageModel.create({
                        title: `teacher-pic-${teacher.id}`,
                        url: filePath.replace(process.cwd() + '/public', ''),
                        imageableId: teacher.id,
                        imageableType: 'teacher'
                    }, { transaction }); // Pass the transaction

                    // Associate the image with the teacher
                    await teacher.setTeacherPicture(image, { transaction }); // Pass the transaction
                }

                // Commit the transaction if everything is successful
                await transaction.commit();

                // Return a success response with the created teacher's personal code
                res.status(StatusCodes.CREATED).json({
                    success: true,
                    message: TeacherMsg.CREATED(teacher.dataValues.personal_code)
                });

            } catch (error) {
                // Rollback the transaction in case of an error
                await transaction.rollback();
                // Pass any errors to the next middleware for handling
                next(error);
            }
        }


        /**
         * Asynchronous function to get a list of teachers with optional filtering and pagination.
         *
         * @param {Object} req - The request object.
         * @param {Object} res - The response object.
         * @param {Function} next - The next middleware function.
         * @returns {Promise<void>} - Returns a Promise that resolves with the response.
         */
        async getTeachers(req = request, res = response, next) {
            try {
                // Extract query parameters for filtering and pagination
                const { page = 1, limit = 10, first_name, last_name, personal_code, is_active } = req.query;

                // Convert page and limit to integers
                const pageNumber = parseInt(page, 10);
                const pageSize = parseInt(limit, 10);

                // Build the filter criteria
                const where = {};
                if (first_name) {
                    where.first_name = {
                        [Op.like]: `%${first_name}%` // Use LIKE for partial matching
                    };
                }
                if (last_name) {
                    where.last_name = {
                        [Op.like]: `%${last_name}%` // Use LIKE for partial matching
                    };
                }
                if (personal_code) {
                    where.personal_code = personal_code; // Exact match
                }
                if (is_active !== undefined) {
                    where.is_active = is_active === 'true'; // Convert string to boolean
                }

                // Fetch teachers with pagination, filtering, and image association
                const { count, rows } = await this.#model.findAndCountAll({
                    where,
                    limit: pageSize,
                    offset: (pageNumber - 1) * pageSize,
                    include: [{
                        model: models.Image, // Assuming Image is the associated model
                        as: 'teacherPicture', // Use the alias defined in the association
                        attributes: ['url'] // Specify the attributes you want to return
                    }]
                });

                // Calculate total pages
                const totalPages = Math.ceil(count / pageSize);

                // Return the response with teachers and pagination info
                res.status(StatusCodes.OK).json({
                    success: true,
                    data: rows,
                    pagination: {
                        totalItems: count,
                        totalPages: totalPages,
                        currentPage: pageNumber,
                        pageSize: pageSize,
                    },
                });
            } catch (error) {
                next(error);
            }
        }


        /**
         * Asynchronous function to get a specific teacher by ID.
         *
         * @param {Object} req - The request object.
         * @param {Object} res - The response object.
         * @param {Function} next - The next middleware function.
         * @returns {Promise<void>} - Returns a Promise that resolves with the response.
         */
        async getTeacher(req = request, res = response, next) {
            try {
                // Extract the teacher ID from the request parameters
                const { id: teacherId } = req.params;

                // Check if the teacher ID is provided
                if (!teacherId) {
                    return res.status(StatusCodes.BAD_REQUEST).json({
                        success: false,
                        message: TeacherMsg.TEACHER_ID_REQUIRED()
                    });
                }

                // Fetch the teacher from the database by ID
                const teacher = await this.#model.findByPk(teacherId, {
                    include: [{
                        model: models.Image, // Assuming Image is the associated model
                        as: 'teacherPicture', // Use the alias defined in the association
                        attributes: ['url'] // Specify the attributes you want to return
                    }]
                });

                // Check if the teacher exists
                if (!teacher) {
                    return res.status(StatusCodes.NOT_FOUND).json({
                        success: false,
                        message: TeacherMsg.NOT_FOUND(teacherId)
                    });
                }

                // Return the found teacher
                res.status(StatusCodes.OK).json({
                    success: true,
                    data: teacher
                });
            } catch (error) {
                next(error);
            }
        }

        /**
         * Updates a teacher's details and profile picture.
         * 
         * @async
         * @param {Object} req - The request object, including the teacher ID in the params and the update data in the body.
         * @param {Object} res - The response object.
         * @param {Function} next - The next middleware function.
         * @returns {Promise<void>}
         */
        async updateTeacher(req = request, res = response, next) {
            const transaction = await sequelize.transaction();

            try {
                const { id: teacherId } = req.params;

                // Extract update data and omit null or empty values
                const updateData = _.omitBy(req.body, value => _.isNil(value) || value === '');

                // Find the teacher
                const teacher = await this.#model.findOne({
                    where: { id: teacherId },
                    transaction
                });

                if (!teacher) {
                    await transaction.rollback();
                    return res.status(StatusCodes.NOT_FOUND).json({
                        success: false,
                        message: `Teacher with ID ${teacherId} not found.`,
                        errors: [{ message: `Teacher with ID ${teacherId} not found.`, path: ['teacher_id'] }]
                    });
                }

                // Handle profile picture update
                if (req.file) {
                    // Delete the current profile picture if it exists
                    const currentImage = await this.#imageModel.findOne({
                        where: { imageableId: teacherId, imageableType: 'teacher' },
                        transaction
                    });

                    if (currentImage) {
                        // Remove the file from the server
                        const imagePath = path.join(process.cwd(), 'public', currentImage.url);
                        fs.unlinkSync(imagePath);

                        // Remove the image record from the database
                        await currentImage.destroy({ transaction });
                    }

                    // Save the new profile picture
                    const { path: filePath } = req.file;
                    const newImage = await this.#imageModel.create({
                        title: `teacher-pic-${teacherId}`,
                        url: filePath.replace(process.cwd() + '/public', ''),
                        imageableId: teacherId,
                        imageableType: 'teacher'
                    }, { transaction });

                    // Associate the new image with the teacher
                    await teacher.setTeacherPicture(newImage, { transaction });
                }

                // Update teacher record
                await teacher.update(updateData, { transaction });

                // Commit the transaction
                await transaction.commit();

                // Respond with the updated teacher data
                res.status(StatusCodes.OK).json({
                    success: true,
                    teacher
                });

            } catch (error) {
                // Rollback the transaction in case of error
                await transaction.rollback();
                next(error);
            }
        }


        /**
         * Deletes a teacher and their profile picture.
         * 
         * @async
         * @param {Object} req - The request object, including the teacher ID in the params.
         * @param {Object} res - The response object.
         * @param {Function} next - The next middleware function.
         * @returns {Promise<void>}
         */
        async deleteTeacher(req = request, res = response, next) {
            const transaction = await sequelize.transaction();

            try {
                const { id: teacherId } = req.params;

                // Find the teacher
                const teacher = await this.#model.findOne({
                    where: { id: teacherId },
                    transaction
                });

                if (!teacher) {
                    await transaction.rollback();
                    return res.status(StatusCodes.NOT_FOUND).json({
                        success: false,
                        message: `Teacher with ID ${teacherId} not found.`,
                        errors: [{ message: `Teacher with ID ${teacherId} not found.`, path: ['teacher_id'] }]
                    });
                }

                // Find the current profile picture if it exists
                const currentImage = await this.#imageModel.findOne({
                    where: { imageableId: teacherId, imageableType: 'teacher' },
                    transaction
                });

                if (currentImage) {
                    // Remove the file from the server
                    const imagePath = path.join(process.cwd(), 'public', currentImage.url);
                    fs.unlinkSync(imagePath);

                    // Remove the image record from the database
                    await currentImage.destroy({ transaction });
                }

                // Delete the teacher record
                await teacher.destroy({ transaction });

                // Commit the transaction
                await transaction.commit();

                // Respond with success message
                res.status(StatusCodes.OK).json({
                    success: true,
                    message: `Teacher with ID ${teacherId} has been deleted.`
                });

            } catch (error) {
                // Rollback the transaction in case of error
                await transaction.rollback();
                next(error);
            }
        }
    }
    return new TeacherController();
})();
