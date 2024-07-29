import { Router } from 'express';
import { registerRoutes } from '../utils/router-registrar.js';
import { AuthorizeMiddleware } from '../middlewares/auth/auth.middlewares.js';
import profileUploader from "../utils/multer.js";
import { TeacherController } from '../controllers/teacher/teacher.controller.js';

const router = Router();

const { isAuthenticated, ensureRoles, ensureRolesOrSuperuser } = AuthorizeMiddleware;

/**
 * Array of route configurations for teacher-related operations.
 *
 * @constant
 * @type {Array}
 * @property {string} method - HTTP method for the route (e.g., 'post', 'get', 'patch', 'delete').
 * @property {string} path - Path for the route (e.g., '/create', '/list', '/:id/update').
 * @property {Array} handler - Array of handler functions for the route.
 */
const teacherRoutes = [
    {
        method: 'post',
        path: '/create',
        handler: [
            profileUploader.single('teacherPicture'),
            TeacherController.createTeacher
        ]
    },
    {
        method: 'get',
        path: '/list',
        handler: [
            TeacherController.getTeachers
        ]
    },
    {
        method: 'get',
        path: '/:id',
        handler: [
            TeacherController.getTeacher
        ]
    },
    {
        method: 'patch',
        path: '/:id/update',
        handler: [
            profileUploader.single('teacherPicture'),
            TeacherController.updateTeacher
        ]
    },
    {
        method: 'delete',
        path: '/:id/delete',
        handler: [
            TeacherController.deleteTeacher
        ]
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
