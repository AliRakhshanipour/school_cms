import { Router } from 'express';
import { TeacherController } from '../controllers/teacher/teacher.controller.js';
import { AuthorizeMiddleware } from '../middlewares/auth/auth.middlewares.js';
import { TeacherService } from '../services/teacher/teacher.service.js';
import profileUploader from '../utils/multer.js';
import { registerRoutes } from '../utils/router-registrar.js';

const router = Router();

const { isAuthenticated, ensureRoles } = AuthorizeMiddleware;

/**
 * Array of route configurations for teacher-related operations.
 *
 * @constant
 * @type {Array}
 * @property {string} method - HTTP method for the route (e.g., 'post', 'get', 'patch', 'delete').
 * @property {string} path - Path for the route (e.g., '/create', '/list', '/:id/update').
 * @property {Array<Function>} [middlewares] - Optional array of middleware functions to apply to the route.
 * @property {Array<Function>} handler - Array of handler functions for the route.
 */
const teacherRoutes = [
  {
    method: 'post',
    path: '/create',
    middlewares: [
      isAuthenticated, // Ensures the user is authenticated
      ensureRoles(['admin']), // Ensures the user has admin role
      profileUploader.single('teacherPicture'), // Handles file upload for teacherPicture
    ],
    handler: [
      TeacherController.createTeacher, // Controller method to handle teacher creation
    ],
  },
  {
    method: 'get',
    path: '/list',
    handler: [
      TeacherController.getTeachers, // Controller method to handle retrieval of teachers list
    ],
  },
  {
    method: 'get',
    path: '/:id',
    handler: [
      TeacherController.getTeacher, // Controller method to handle retrieval of a specific teacher by ID
    ],
  },
  {
    method: 'patch',
    path: '/:id/update',
    middlewares: [
      isAuthenticated, // Ensures the user is authenticated
      ensureRoles(['admin']), // Ensures the user has admin role
      profileUploader.single('teacherPicture'), // Handles file upload for teacherPicture
    ],
    handler: [
      TeacherController.updateTeacher, // Controller method to handle teacher update
    ],
  },
  {
    method: 'delete',
    path: '/:id/delete',
    middlewares: [
      // isAuthenticated, // Ensures the user is authenticated
      // ensureRoles(['admin']), // Ensures the user has admin role
    ],
    handler: [
      TeacherController.deleteTeacher, // Controller method to handle teacher deletion
    ],
  },
  {
    method: 'get',
    path: '/:id/sessions',
    handler: [
      TeacherService.getSessions, // Controller method to handle retrieval of teachers list
    ],
  },
];

/**
 * Registers teacher-related routes with the Express router.
 *
 * This function iterates over the `teacherRoutes` array and registers each route with the corresponding HTTP method and path.
 * The `registerRoutes` utility function is used to handle the registration process.
 */
registerRoutes(router, teacherRoutes);

export default router;
