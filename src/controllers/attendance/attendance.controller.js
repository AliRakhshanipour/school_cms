import { request, response } from 'express';
import { models } from '../../models/index.js';
import BaseController from '../base.controller.js';

export const AttendanceController = (() => {
  class AttendanceController extends BaseController {
    #model = models.Attendance;
    #sessionModel = models.Session;
    #studentModel = models.Student;

    // TODO createAttendance
    async createAttendance(req = request, res = response, next) {
      try {
      } catch (error) {
        next(error);
      }
    }

    // TODO getAttendance
    async getAttendance(req = request, res = response, next) {
      try {
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

    // TODO getAttendances
    async getAttendances(req = request, res = response, next) {
      try {
      } catch (error) {
        next(error);
      }
    }
  }
  return new AttendanceController();
})();
