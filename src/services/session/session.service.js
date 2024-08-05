import { request, response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { RoomMsg } from '../../controllers/room/room.messages.js';
import { SessionMsg } from '../../controllers/session/session.messages.js';
import { models } from '../../models/index.js';
import BaseService from '../base.service.js';

export const SessionService = (() => {
  class SessionService extends BaseService {
    #model = models.Session;
    #classModel = models.Class;
    #roomModel = models.Room;
    #teacherModel = models.Teacher;

    async changeTeacherSession(req = request, res = response, next) {
      try {
        const { id: sessionId } = req.params;
        const { teacherId } = req.body;

        // Validate required parameters
        if (!sessionId) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: SessionMsg.REQUIRED_SESSION_ID(),
          });
        }

        if (!teacherId) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: SessionMsg.REQUIRED_TEACHER_ID(),
          });
        }

        // Check if the teacher exists
        const teacher = await this.#teacherModel.findByPk(teacherId);
        if (!teacher) {
          return res.status(StatusCodes.NOT_FOUND).json({
            success: false,
            message: SessionMsg.TEACHER_NOT_FOUND(teacherId),
          });
        }

        // Check if the session exists
        const session = await this.#model.findByPk(sessionId);
        if (!session) {
          return res.status(StatusCodes.NOT_FOUND).json({
            success: false,
            message: SessionMsg.NOT_FOUND(sessionId),
          });
        }

        // Update the session with the new teacher ID
        await session.update({ teacherId });
        await session.save();

        // Respond with success message
        res.status(StatusCodes.OK).json({
          success: true,
          message: SessionMsg.UPDATED_SUCCESS(sessionId),
        });
      } catch (error) {
        console.error('Error updating session:', error); // Added logging for error
        next(error);
      }
    }

    async changeRoomSession(req = request, res = response, next) {
      try {
        const { id: sessionId } = req.params;
        const { roomId } = req.body;

        if (!sessionId) {
          res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: SessionMsg.REQUIRED_SESSION_ID(),
          });
        }

        if (!roomId) {
          res
            .status(StatusCodes.BAD_REQUEST)
            .json({ success: false, message: SessionMsg.REQUIRED_ROOM_ID() });
        }

        const session = await this.#model.findByPk(sessionId);
        if (!session) {
          res.status(StatusCodes.NOT_FOUND).json({
            success: false,
            message: SessionMsg.NOT_FOUND(sessionId),
          });
        }

        (await this.#roomModel.findByPk(roomId)) ||
          res.status(StatusCodes.NOT_FOUND).json({
            success: false,
            message: RoomMsg.NOT_FOUND(roomId),
          });

        await session.update({ roomId });
        await session.save();

        res.status(StatusCodes.OK).json({
          success: true,
          message: SessionMsg.UPDATED_SUCCESS(sessionId),
        });
      } catch (error) {
        next(error);
      }
    }
  }
  return new SessionService();
})();
