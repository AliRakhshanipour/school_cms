import { request, response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { StudentMsg } from '../../controllers/student/student.messages.js';
import { models } from '../../models/index.js';
import BaseService from '../base.service.js';

export const StudentService = (() => {
  class StudentService extends BaseService {
    #model = models.Student;
    #attendanceModel = models.Attendance;
    #classModel = models.Class;
    #sessionModel = models.Session;
    #teacherModel = models.Teacher;

    /**
     * Get attendances for a specific student with optional filters.
     *
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @param {Function} next - The next middleware function.
     */
    async getStudentAttendances(req = request, res = response, next) {
      try {
        const { id: studentId } = req.params;
        const { status, startTime, endTime, day, lesson } = req.query;

        // Check if studentId is provided
        if (!studentId) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: StudentMsg.STUDENT_ID_REQUIRED(),
          });
        }

        const student = await this.#model.findByPk(studentId);

        if (!student) {
          return res.status(StatusCodes.NOT_FOUND).json({
            success: false,
            message: StudentMsg.NOT_FOUND(studentId),
          });
        }

        // Build where clause for attendances
        const attendanceFilters = { studentId };
        if (status) {
          attendanceFilters.status = status;
        }

        // Build where clause for sessions
        const sessionFilters = {};
        if (startTime) {
          sessionFilters.startTime = startTime;
        }
        if (endTime) {
          sessionFilters.endTime = endTime;
        }
        if (day) {
          sessionFilters.day = day;
        }
        if (lesson) {
          sessionFilters.lesson = lesson;
        }

        // Fetch attendances for the given student ID
        const attendances = await this.#attendanceModel.findAll({
          where: attendanceFilters,
          attributes: {
            exclude: ['id', 'studentId', 'sessionId', 'createdAt', 'updatedAt'],
          },
          include: [
            {
              model: this.#model,
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
              where: sessionFilters,
              attributes: ['lesson', 'day', 'startTime', 'endTime'],
              include: [
                {
                  model: this.#teacherModel,
                  attributes: ['first_name', 'last_name', 'personal_code'],
                },
              ],
            },
          ],
        });

        // Respond with the fetched attendances
        return res.status(StatusCodes.OK).json({
          success: true,
          attendances,
        });
      } catch (error) {
        next(error);
      }
    }
  }
  return new StudentService();
})();
