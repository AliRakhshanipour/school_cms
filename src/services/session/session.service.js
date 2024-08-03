import { request, response } from 'express';
import { models } from '../../models/index.js';
import BaseService from '../base.service.js';

export const SessionService = (() => {
  class SessionService extends BaseService {
    #model = models.Session;
    #classModel = models.Class;
    #roomModel = models.Room;
    #teacherModel = models.Teacher;

    // TODO changeTeacherSession
    async changeTeacherSession(req = request, res = response, next) {
      try {
      } catch (error) {
        next(error);
      }
    }

    // TODO changeRoomSession
    async changeRoomSession(req = request, res = response, next) {
      try {
      } catch (error) {
        next(error);
      }
    }

    // TODO changeTeacherSession
    async changeTeacherSession(req = request, res = response, next) {
      try {
      } catch (error) {
        next(error);
      }
    }
  }
  return new SessionService();
})();
