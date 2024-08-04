import { StatusCodes } from 'http-status-codes';
import { TeacherMsg } from '../../controllers/teacher/teacher.messages.js';
import { models } from '../../models/index.js';
import BaseService from '../base.service.js';

export const TeacherService = (() => {
  class TeacherService extends BaseService {
    #model = models.Teacher;
    #sessionModel = models.Session;
    #classModel = models.Class;
    #roomModel = models.Room;

    /**
     * Retrieves all sessions for a specific teacher.
     *
     * @async
     * @param {Object} req - The request object, containing the teacher ID in URL parameters.
     * @param {Object} res - The response object used to send the HTTP response.
     * @param {Function} next - The next middleware function in the request-response cycle.
     * @returns {Promise<void>} - Returns a Promise that resolves with the response. If sessions are found, it returns them; otherwise, it returns an error message.
     */
    async getSessions(req, res, next) {
      try {
        const { id: teacherId } = req.params;

        // Validate required parameter
        if (!teacherId) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: TeacherMsg.TEACHER_ID_REQUIRED,
          });
        }

        // Fetch sessions
        const sessions = await this.#sessionModel.findAll({
          where: { teacherId },
          attributes: ['id', 'day', 'startTime', 'endTime'],
          include: [
            {
              model: this.#classModel,
              attributes: ['number'],
            },
            {
              model: this.#roomModel,
              attributes: ['number'],
            },
          ],
        });

        // Check if any sessions are found
        if (!sessions.length) {
          return res.status(StatusCodes.NOT_FOUND).json({
            success: false,
            message: TeacherMsg.SESSION_NOT_FOUND(teacherId),
          });
        }

        // Respond with sessions
        res.status(StatusCodes.OK).json({
          success: true,
          sessions,
        });
      } catch (error) {
        next(error); // Pass errors to the next middleware
      }
    }
  }
  return new TeacherService();
})();
