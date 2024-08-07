import autoBind from 'auto-bind';
import { request, response } from 'express';
import { StatusCodes } from 'http-status-codes';
import _ from 'lodash';
import { Op } from 'sequelize';
import { models } from '../../models/index.js';
import { StudentMsg } from './student.messages.js';

export const StudentController = (() => {
  /**
   * Controller class for managing student-related operations.
   */
  class StudentController {
    #model;
    #imageModel;

    constructor() {
      autoBind(this);
      this.#model = models.Student;
      this.#imageModel = models.Image;
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
    async createStudent(req = request, res = response, next) {
      try {
        // Extract student data from the request body
        const studentData = req.body;

        // Check for uniqueness of national_code
        const existingStudent = await this.#model.findOne({
          where: { national_code: studentData.national_code },
        });

        if (existingStudent) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'National code must be unique.',
            errors: [
              {
                message: StudentMsg.UNIQUE_NATIONAL_CODE(
                  studentData.national_code
                ),
                path: ['national_code'],
              },
            ],
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
            imageableType: 'student',
          });

          // Associate the image with the student
          await student.setStudentPicture(image);
        }

        // Respond with the created student data
        res.status(StatusCodes.CREATED).json({
          success: true,
          student,
        });
      } catch (error) {
        next(error);
      }
    }

    /**
     * Creates multiple new students.
     *
     * @async
     * @param {Object} req - The request object containing an array of student data.
     * @param {Object} res - The response object.
     * @param {Function} next - The next middleware function.
     * @returns {Promise<void>}
     */
    async createStudents(req = request, res = response, next) {
      try {
        const studentsData = req.body;

        if (!Array.isArray(studentsData) || studentsData.length === 0) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'Invalid input. An array of student objects is required.',
            errors: [
              { message: 'No student data provided', path: 'studentsData' },
            ],
          });
        }

        // Validate each student data object
        const errors = [];
        const validStudents = [];

        for (const studentData of studentsData) {
          const existingStudent = await this.#model.findOne({
            where: { national_code: studentData.national_code },
          });

          if (existingStudent) {
            errors.push({
              message: `National code ${studentData.national_code} already exists.`,
              path: ['national_code'],
            });
            continue;
          }

          validStudents.push(studentData);
        }

        if (errors.length > 0) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'Validation errors.',
            errors,
          });
        }

        // Bulk create students
        const createdStudents = await this.#model.bulkCreate(validStudents);

        // Handle profile pictures if needed
        // Iterate through validStudents to upload profile pictures if files are present

        res.status(StatusCodes.CREATED).json({
          success: true,
          students: createdStudents,
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
          max_discipline_grade,
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
              attributes: ['url'], // Only include the URL in the response
            },
          ],
        });

        // Respond with the list of students
        res.status(StatusCodes.OK).json({
          success: true,
          students,
        });
      } catch (error) {
        next(error);
      }
    }

    /**
     * Retrieves a single student by ID, including an optional profile picture.
     *
     * @async
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @param {Function} next - The next middleware function.
     * @returns {Promise<void>}
     */
    async getStudent(req = request, res = response, next) {
      try {
        // Extract student ID from request parameters
        const { id: studentId } = req.params;

        // Fetch the student by primary key, excluding certain attributes
        const student = await this.#model.findByPk(studentId, {
          attributes: {
            exclude: ['createdAt', 'updatedAt'],
          },
          include: [
            {
              model: this.#imageModel,
              as: 'studentPicture',
              where: { imageableType: 'student' },
              attributes: ['url'],
              required: false,
            },
          ],
        });

        if (!student) {
          return res.status(StatusCodes.NOT_FOUND).json({
            success: false,
            message: StudentMsg.NOT_FOUND(studentId),
          });
        }

        // Respond with the student data
        res.status(StatusCodes.OK).json({
          success: true,
          student,
        });
      } catch (error) {
        // Pass errors to the error-handling middleware
        next(error);
      }
    }

    /**
     * Updates a student's details and profile picture.
     *
     * @async
     * @param {Object} req - The request object, including the student ID in the params and the update data in the body.
     * @param {Object} res - The response object.
     * @param {Function} next - The next middleware function.
     * @returns {Promise<void>}
     */
    async updateStudent(req = request, res = response, next) {
      try {
        const { id: studentId } = req.params;

        const updateData = _.omitBy(
          req.body,
          (value) => _.isNil(value) || value === ''
        );

        // Find the student
        const student = await this.#model.findOne({
          where: { id: studentId },
        });

        if (!student) {
          return res.status(StatusCodes.NOT_FOUND).json({
            success: false,
            message: StudentMsg.NOT_FOUND(studentId),
            errors: [
              {
                message: `Student with ID ${studentId} not found.`,
                path: ['student_id'],
              },
            ],
          });
        }

        // Handle profile picture update
        if (req.file) {
          // Delete the current profile picture if it exists
          const currentImage = await this.#imageModel.findOne({
            where: { imageableId: studentId, imageableType: 'student' },
          });

          if (currentImage) {
            // Remove the file from the server
            const imagePath = path.join(
              process.cwd(),
              'public',
              currentImage.url
            );
            fs.unlinkSync(imagePath);

            // Remove the image record from the database
            await currentImage.destroy();
          }

          // Save the new profile picture
          const { path: filePath } = req.file;
          const newImage = await this.#imageModel.create({
            title: `student-pic-${studentId}`,
            url: filePath.replace(process.cwd() + '/public', ''),
            imageableId: studentId,
            imageableType: 'student',
          });

          // Associate the new image with the student
          await student.setStudentPicture(newImage);
        }

        // Update student record
        await student.update(updateData);

        // Respond with the updated student data
        res.status(StatusCodes.OK).json({
          success: true,
          student,
        });
      } catch (error) {
        next(error);
      }
    }

    /**
     * Deletes a student and profile picture.
     *
     * @async
     * @param {Object} req - The request object, including the student ID in the params.
     * @param {Object} res - The response object.
     * @param {Function} next - The next middleware function.
     * @returns {Promise<void>}
     */
    async deleteStudent(req, res, next) {
      try {
        const { id: studentId } = req.params;
        const student = await this.#model.findByPk(studentId);

        if (!student) {
          return res.status(404).json({
            success: false,
            message: StudentMsg.NOT_FOUND(studentId),
            errors: [
              {
                message: `Student with ID ${studentId} not found.`,
                path: ['student_id'],
              },
            ],
          });
        }

        await student.destroy();

        return res.status(StatusCodes.NO_CONTENT).json({ success: true });
      } catch (error) {
        next(error);
      }
    }
  }

  return new StudentController();
})();
