import { request, response } from 'express';
import { StatusCodes } from 'http-status-codes';
import _ from 'lodash';
import { Op } from 'sequelize';
import { models } from '../../models/index.js';
import BaseController from '../base.controller.js';
import { AttendanceMsg } from './attendance.messages.js';
import { attendanceValidationSchema } from './attendance.validation.js';

export const AttendanceController = (() => {
  class AttendanceController extends BaseController {
    #model = models.Attendance;
    #sessionModel = models.Session;
    #studentModel = models.Student;
    #classModel = models.Class;
    #teacherModel = models.Teacher;

    /**
     * Creates a new attendance record.
     *
     * @async
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     * @param {Function} next - Express next middleware function.
     * @returns {Promise<void>}
     */
    async createAttendance(req = request, res = response, next) {
      try {
        const attendanceData = _.omitBy(
          req.body,
          (value) => _.isNil(value) || value === ''
        );
        const { error } = attendanceValidationSchema.validate(attendanceData);
        if (error) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: error.details[0].message,
          });
        }

        const { sessionId, studentId } = attendanceData;

        // Check if the session exists
        const session = await this.#sessionModel.findByPk(sessionId);
        if (!session) {
          return res.status(StatusCodes.NOT_FOUND).json({
            success: false,
            message: AttendanceMsg.NOT_FOUND_SESSION(sessionId),
          });
        }

        // Check if the student exists
        const student = await this.#studentModel.findByPk(studentId);
        if (!student) {
          return res.status(StatusCodes.NOT_FOUND).json({
            success: false,
            message: AttendanceMsg.NOT_FOUND_STUDENT(studentId),
          });
        }

        // Set the date to the current date if not provided
        if (!attendanceData.date) {
          attendanceData.date = new Date().toISOString().split('T')[0];
        }

        const attendance = await this.#model.create(attendanceData);
        if (!attendance) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: AttendanceMsg.NOT_CREATED(),
          });
        }

        res.status(StatusCodes.CREATED).json({
          success: true,
          attendance,
        });
      } catch (error) {
        next(error);
      }
    }

    // TODO getAttendance
    async getAttendance(req = request, res = response, next) {
      try {
        const { id: attendanceId } = req.params;

        if (!attendanceId) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: AttendanceMsg.ATTENDANCE_ID_REQUIRED(),
          });
        }

        const attendance = await this.#model.findByPk(attendanceId, {
          attributes: {
            exclude: ['id', 'createdAt', 'updatedAt'],
          },
          include: [
            {
              model: this.#studentModel,
              attributes: ['first_name', 'last_name', 'national_code'],
              include: [
                {
                  model: this.#classModel,
                  attributes: ['number'],
                },
              ],
            },
            {
              model: this.#sessionModel,
              attributes: ['lesson'],
              include: [
                {
                  model: this.#teacherModel,
                  attributes: ['first_name', 'last_name', 'personal_code'],
                },
              ],
            },
          ],
        });

        if (!attendance) {
          return res.status(StatusCodes.NOT_FOUND).json({
            success: false,
            message: AttendanceMsg.NOT_FOUND(attendanceId),
          });
        }

        return res.status(StatusCodes.OK).json({
          success: true,
          attendance,
        });
      } catch (error) {
        next(error);
      }
    }

    // TODO getAttendances
    async getAttendances(req = request, res = response, next) {
      try {
        const { first_name, last_name, national_code, roomId } = req.query;

        const whereClauses = {};

        // Add filters for student attributes
        if (first_name) {
          whereClauses['$Student.first_name$'] = {
            [Op.like]: `%${first_name}%`,
          };
        }
        if (last_name) {
          whereClauses['$Student.last_name$'] = { [Op.like]: `%${last_name}%` };
        }
        if (national_code) {
          whereClauses['$Student.national_code$'] = {
            [Op.like]: `%${national_code}%`,
          };
        }

        // Add filter for session's roomId
        if (roomId) {
          whereClauses['$Session.roomId$'] = roomId;
        }

        const attendances = await this.#model.findAll({
          where: whereClauses,
          attributes: {
            exclude: ['id', 'createdAt', 'updatedAt'],
          },
          include: [
            {
              model: this.#studentModel,
              attributes: ['first_name', 'last_name', 'national_code'],
              include: [
                {
                  model: this.#classModel,
                  attributes: ['number'],
                },
              ],
            },
            {
              model: this.#sessionModel,
              attributes: ['lesson', 'roomId'],
              include: [
                {
                  model: this.#teacherModel,
                  attributes: ['first_name', 'last_name', 'personal_code'],
                },
              ],
            },
          ],
        });

        res.status(StatusCodes.OK).json({
          success: true,
          attendances,
        });
      } catch (error) {
        next(error);
      }
    }

    // TODO updateAttendance
    async updateAttendance(req = request, res = response, next) {
      try {
      } catch (error) {
        next(error);
      }
    }

    // TODO deleteAttendance
    async deleteAttendance(req = request, res = response, next) {
      try {
      } catch (error) {
        next(error);
      }
    }
  }
  return new AttendanceController();
})();
