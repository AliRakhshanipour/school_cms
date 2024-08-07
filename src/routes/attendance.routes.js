import { Router } from 'express';
import { AttendanceController } from '../controllers/attendance/attendance.controller.js';
import { registerRoutes } from '../utils/router-registrar.js';

const router = Router();

/**
 * Array of route configurations for attendance-related operations.
 *
 * @constant
 * @type {Array}
 * @property {string} method - HTTP method for the route (e.g., 'post', 'get', 'patch', 'delete').
 * @property {string} path - Path for the route (e.g., '/create', '/list', '/:id/update').
 * @property {Array<Function>} [middlewares] - Optional array of middleware functions to apply to the route.
 * @property {Array<Function>} handler - Array of handler functions for the route.
 */
const attendanceRoutes = [
  {
    method: 'post',
    path: '/create',
    middlewares: [],
    handler: [AttendanceController.createAttendance],
  },
  {
    method: 'get',
    path: '/list',
    handler: [AttendanceController.getAttendances],
  },
  {
    method: 'get',
    path: '/:id',
    handler: [AttendanceController.getAttendance],
  },
  {
    method: 'patch',
    path: '/:id/update',
    middlewares: [],
    handler: [],
  },
  {
    method: 'delete',
    path: '/:id/delete',
    middlewares: [],
    handler: [],
  },
];

/**
 * Registers attendance-related routes with the Express router.
 *
 * This function iterates over the `attendanceRoutes` array and registers each route with the corresponding HTTP method and path.
 * The `registerRoutes` utility function is used to handle the registration process.
 */
registerRoutes(router, attendanceRoutes);

export default router;
