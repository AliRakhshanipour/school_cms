import autoBind from 'auto-bind';
import { request, response } from 'express';
import { StatusCodes } from 'http-status-codes';
import _ from 'lodash';
import { sequelize } from '../../configs/database.conf.js';
import { models } from '../../models/index.js';
import { TeacherMsg } from './teacher.messages.js';

export const TeacherController = (() => {
  class TeacherController {
    #model;
    #imageModel;
    #userModel;
    constructor() {
      autoBind(this);
      this.#model = models.Teacher;
      this.#imageModel = models.Image;
      this.#userModel = models.User;
    }

    /**
     * Creates a new teacher record in the database.
     *
     * This asynchronous method handles:
     * 1. Validating if a teacher with the same personal code already exists.
     * 2. Creating a new teacher record if no existing record is found.
     * 3. Creating a user associated with the teacher.
     * 4. Optionally processing an uploaded file (e.g., an image) and associating it with the newly created teacher.
     *
     * @param {Object} req - The request object containing teacher data and any uploaded files.
     * @param {Object} res - The response object for sending back the HTTP response.
     * @param {Function} next - The next middleware function in the stack for error handling.
     * @returns {Promise<void>} - Resolves when the operation is complete.
     * @throws {Error} - Passes errors to the next middleware for handling.
     */
    async createTeacher(req = request, res = response, next) {
      const transaction = await sequelize.transaction(); // Start a transaction

      try {
        // Extract teacher data from the request body
        const teacherData = this.#extractTeacherData(req.body);

        // Check if a teacher with the same personal code already exists
        if (
          await this.#isTeacherExists(teacherData.personal_code, transaction)
        ) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: TeacherMsg.UNIQUE_PERSONAL_CODE(),
          });
        }

        // Create a new teacher record
        const teacher = await this.#model.create(teacherData, { transaction });
        if (!teacher) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: TeacherMsg.NOT_CREATED(),
          });
        }

        // Create a user with role 'teacher'
        const userData = this.#buildUserData(teacherData);
        const user = await this.#userModel.create(userData, { transaction });
        if (!user) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'User creation failed.',
          });
        }

        // Process uploaded file if exists
        if (req.file) {
          await this.#processTeacherImage(req.file, teacher, transaction);
        }

        // Commit the transaction
        await transaction.commit();

        // Return success response
        return res.status(StatusCodes.CREATED).json({
          success: true,
          message: TeacherMsg.CREATED(teacher.dataValues.personal_code),
        });
      } catch (error) {
        // Rollback the transaction in case of an error
        await transaction.rollback();
        next(error); // Pass errors to the next middleware
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
        const { page = 1, limit = 10, ...filters } = req.query;
        const pageNumber = parseInt(page, 10);
        const pageSize = parseInt(limit, 10);

        const where = this._buildFilterCriteria(filters);
        const { count, rows } = await this.#model.findAndCountAll({
          where,
          limit: pageSize,
          offset: (pageNumber - 1) * pageSize,
          include: this._getImageInclude(),
        });

        const totalPages = Math.ceil(count / pageSize);

        res.status(StatusCodes.OK).json({
          success: true,
          data: rows,
          pagination: {
            totalItems: count,
            totalPages,
            currentPage: pageNumber,
            pageSize,
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
        const { id: teacherId } = req.params;

        if (!teacherId) {
          return this._sendErrorResponse(
            res,
            StatusCodes.BAD_REQUEST,
            TeacherMsg.TEACHER_ID_REQUIRED()
          );
        }

        const teacher = await this.#model.findByPk(teacherId, {
          include: this._getImageInclude(),
        });

        if (!teacher) {
          return this._sendErrorResponse(
            res,
            StatusCodes.NOT_FOUND,
            TeacherMsg.NOT_FOUND(teacherId)
          );
        }

        res.status(StatusCodes.OK).json({
          success: true,
          data: teacher,
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
        const updateData = _.omitBy(
          req.body,
          (value) => _.isNil(value) || value === ''
        );

        const teacher = await this.#model.findOne({
          where: { id: teacherId },
          transaction,
        });

        if (!teacher) {
          await transaction.rollback();
          return this._sendErrorResponse(
            res,
            StatusCodes.NOT_FOUND,
            `Teacher with ID ${teacherId} not found.`
          );
        }

        if (req.file) {
          await this._handleProfilePictureUpdate(
            req.file,
            teacherId,
            transaction
          );
        }

        await teacher.update(updateData, { transaction });
        await transaction.commit();

        res.status(StatusCodes.OK).json({
          success: true,
          data: teacher,
        });
      } catch (error) {
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

        const teacher = await this.#model.findOne({
          where: { id: teacherId },
          transaction,
        });

        if (!teacher) {
          await transaction.rollback();
          return this._sendErrorResponse(
            res,
            StatusCodes.NOT_FOUND,
            `Teacher with ID ${teacherId} not found.`
          );
        }

        await this._handleProfilePictureDeletion(teacherId, transaction);
        await teacher.destroy({ transaction });
        await transaction.commit();

        res.status(StatusCodes.OK).json({
          success: true,
          message: `Teacher with ID ${teacherId} has been deleted.`,
        });
      } catch (error) {
        await transaction.rollback();
        next(error);
      }
    }

    /**
     * Extracts teacher data from the request body.
     * @param {Object} body - The request body containing teacher data.
     * @returns {Object} - The extracted teacher data.
     */
    #extractTeacherData(body) {
      const {
        first_name,
        last_name,
        personal_code,
        phone,
        email,
        hire_date,
        subject_specialization,
        date_of_birth,
      } = body;

      return {
        first_name,
        last_name,
        personal_code,
        phone,
        email,
        hire_date,
        subject_specialization,
        date_of_birth,
      };
    }

    /**
     * Checks if a teacher with the same personal code already exists.
     * @param {string} personalCode - The personal code of the teacher.
     * @param {Transaction} transaction - The Sequelize transaction object.
     * @returns {Promise<boolean>} - True if the teacher exists, otherwise false.
     */
    async #isTeacherExists(personalCode, transaction) {
      const existingTeacher = await this.#model.findOne({
        where: { personal_code: personalCode },
        transaction,
      });
      return Boolean(existingTeacher);
    }

    /**
     * Builds the user data object for user creation.
     * @param {Object} teacherData - The data of the newly created teacher.
     * @returns {Object} - The data object for the new user.
     */
    #buildUserData(teacherData) {
      return {
        username: teacherData.phone,
        email: `${teacherData.phone}@example.com`,
        phone: teacherData.phone,
        password: teacherData.personal_code, // Set the password as personal code
        role: 'teacher',
      };
    }

    /**
     * Processes and associates an uploaded image with the teacher.
     * @param {Object} file - The uploaded file object.
     * @param {Teacher} teacher - The created teacher record.
     * @param {Transaction} transaction - The Sequelize transaction object.
     * @returns {Promise<void>}
     */
    async #processTeacherImage(file, teacher, transaction) {
      const { path: filePath } = file;

      const image = await this.#imageModel.create(
        {
          title: `teacher-pic-${teacher.id}`,
          url: filePath.replace(process.cwd() + '/public', ''),
          imageableId: teacher.id,
          imageableType: 'teacher',
        },
        { transaction }
      );

      await teacher.setTeacherPicture(image, { transaction });
    }

    /**
     * Build filter criteria for querying teachers.
     *
     * @param {Object} filters - The filters extracted from the query.
     * @returns {Object} - The filter criteria.
     */
    _buildFilterCriteria(filters) {
      const where = {};

      if (filters.first_name) {
        where.first_name = { [Op.like]: `%${filters.first_name}%` };
      }
      if (filters.last_name) {
        where.last_name = { [Op.like]: `%${filters.last_name}%` };
      }
      if (filters.personal_code) {
        where.personal_code = filters.personal_code;
      }
      if (filters.is_active !== undefined) {
        where.is_active = filters.is_active === 'true';
      }

      return where;
    }

    /**
     * Get image association include options.
     *
     * @returns {Array} - The include options for image association.
     */
    _getImageInclude() {
      return [
        {
          model: models.Image,
          as: 'teacherPicture',
          attributes: ['url'],
        },
      ];
    }

    /**
     * Handle profile picture update logic.
     *
     * @param {Object} file - The uploaded file object.
     * @param {number} teacherId - The ID of the teacher being updated.
     * @param {Object} transaction - The transaction object.
     * @returns {Promise<void>}
     */
    async _handleProfilePictureUpdate(file, teacherId, transaction) {
      const currentImage = await this.#imageModel.findOne({
        where: { imageableId: teacherId, imageableType: 'teacher' },
        transaction,
      });

      if (currentImage) {
        const imagePath = path.join(process.cwd(), 'public', currentImage.url);
        fs.unlinkSync(imagePath);
        await currentImage.destroy({ transaction });
      }

      const { path: filePath } = file;
      const newImage = await this.#imageModel.create(
        {
          title: `teacher-pic-${teacherId}`,
          url: filePath.replace(process.cwd() + '/public', ''),
          imageableId: teacherId,
          imageableType: 'teacher',
        },
        { transaction }
      );

      await this.#model
        .findByPk(teacherId, { transaction })
        .setTeacherPicture(newImage, { transaction });
    }

    /**
     * Handle profile picture deletion logic.
     *
     * @param {number} teacherId - The ID of the teacher being deleted.
     * @param {Object} transaction - The transaction object.
     * @returns {Promise<void>}
     */
    async _handleProfilePictureDeletion(teacherId, transaction) {
      const currentImage = await this.#imageModel.findOne({
        where: { imageableId: teacherId, imageableType: 'teacher' },
        transaction,
      });

      if (currentImage) {
        const imagePath = path.join(process.cwd(), 'public', currentImage.url);
        fs.unlinkSync(imagePath);
        await currentImage.destroy({ transaction });
      }
    }

    /**
     * Send error response with appropriate status and message.
     *
     * @param {Object} res - The response object.
     * @param {number} statusCode - The HTTP status code.
     * @param {string} message - The error message.
     * @returns {Object} - The response object.
     */
    _sendErrorResponse(res, statusCode, message) {
      return res.status(statusCode).json({
        success: false,
        message,
      });
    }
  }
  return new TeacherController();
})();
