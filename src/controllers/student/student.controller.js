import autoBind from "auto-bind";
import { models } from "../../models/index.js";
import { request, response } from "express";
import { StatusCodes } from "http-status-codes";
import { StudentMsg } from "./student.messages.js";
import logger from "../../services/log/log.module.js";
import { Op } from "sequelize";

export const StudentController = (() => {
    /**
     * Controller class for managing student-related operations.
     */
    class StudentController {
        #model;
        #imageModel;
        #logger;

        constructor() {
            autoBind(this);
            this.#model = models.Student;
            this.#imageModel = models.Image;
            this.#logger = logger;
        }

        /**
         * Creates a new student with an optional profile picture.
         * 
         * @async
         * @param {Object} req - The request object.
         * @param {Object} res - The response object.
         * @param {Function} next - The next middleware function.
         * @returns {Promise<void>}
         */
        async create(req = request, res = response, next) {
            try {
                // Extract student data from the request body
                const studentData = req.body;

                // Check for uniqueness of national_code
                const existingStudent = await this.#model.findOne({
                    where: { national_code: studentData.national_code }
                });

                if (existingStudent) {
                    return res.status(StatusCodes.BAD_REQUEST).json({
                        success: false,
                        message: 'National code must be unique.',
                        errors: [{ message: StudentMsg.UNIQUE_NATIONAL_CODE(studentData.national_code), path: ['national_code'] }]
                    });
                }

                // Create student record
                const student = await this.#model.create(studentData);



                // Check if a file is uploaded and process it
                if (req.file) {
                    const { path: filePath } = req.file;

                    // Save the image and associate it with the student
                    const image = await this.#imageModel.create({
                        title: `student-pic-${student.id}`,
                        url: filePath.replace(process.cwd() + '/public', ''),
                        imageableId: student.id,
                        imageableType: 'student'
                    });

                    // Associate the image with the student
                    await student.setStudentPicture(image);
                }

                // Respond with the created student data
                res.status(StatusCodes.CREATED).json({
                    success: true,
                    student
                });
            } catch (error) {
                next(error);
            }
        }

        /**
         * Retrieves a list of students with optional filters for national code, first name, last name,
         * and ranges for average grade, math grade, and discipline grade.
         * 
         * @async
         * @param {Object} req - The request object.
         * @param {Object} res - The response object.
         * @param {Function} next - The next middleware function.
         * @returns {Promise<void>}
         */
        async getStudents(req = request, res = response, next) {
            try {
                // Extract query parameters
                const {
                    limit = 10,
                    offset = 0,
                    national_code,
                    first_name,
                    last_name,
                    min_avg_grade,
                    max_avg_grade,
                    min_math_grade,
                    max_math_grade,
                    min_discipline_grade,
                    max_discipline_grade
                } = req.query;

                // Prepare filter conditions
                const whereConditions = {};

                if (national_code) {
                    whereConditions.national_code = national_code;
                }
                if (first_name) {
                    whereConditions.first_name = first_name;
                }
                if (last_name) {
                    whereConditions.last_name = last_name;
                }
                if (min_avg_grade || max_avg_grade) {
                    whereConditions.avg_grade = {};
                    if (min_avg_grade) {
                        whereConditions.avg_grade[Op.gte] = min_avg_grade;
                    }
                    if (max_avg_grade) {
                        whereConditions.avg_grade[Op.lte] = max_avg_grade;
                    }
                }
                if (min_math_grade || max_math_grade) {
                    whereConditions.math_grade = {};
                    if (min_math_grade) {
                        whereConditions.math_grade[Op.gte] = min_math_grade;
                    }
                    if (max_math_grade) {
                        whereConditions.math_grade[Op.lte] = max_math_grade;
                    }
                }
                if (min_discipline_grade || max_discipline_grade) {
                    whereConditions.discipline_grade = {};
                    if (min_discipline_grade) {
                        whereConditions.discipline_grade[Op.gte] = min_discipline_grade;
                    }
                    if (max_discipline_grade) {
                        whereConditions.discipline_grade[Op.lte] = max_discipline_grade;
                    }
                }

                // Fetch students from the database, including associated images
                const students = await this.#model.findAll({
                    where: whereConditions,
                    limit: parseInt(limit, 10),
                    offset: parseInt(offset, 10),
                    include: [
                        {
                            model: this.#imageModel,
                            as: 'studentPicture',
                            attributes: ['url'] // Only include the URL in the response
                        }
                    ]
                });

                // Respond with the list of students
                res.status(StatusCodes.OK).json({
                    success: true,
                    students
                });
            } catch (error) {
                next(error);
            }
        }
    }

    return new StudentController();
})();
