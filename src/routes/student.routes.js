import { Router } from 'express';
import { registerRoutes } from '../utils/router-registrar.js';
import { AuthorizeMiddleware } from '../middlewares/auth/auth.middlewares.js';
import profileUploader from "../utils/multer.js";
import { StudentController } from '../controllers/student/student.controller.js';
import { validateStudent } from '../middlewares/validations/student.validation.js';

const router = Router();

const { isAuthenticated, ensureRoles, ensureRolesOrSuperuser } = AuthorizeMiddleware;

/**
 * Array of route configurations for student-related operations.
 *
 * @constant
 * @type {Array}
 * @property {string} method - HTTP method for the route (e.g., 'post', 'get', 'patch', 'delete').
 * @property {string} path - Path for the route (e.g., '/create', '/list', '/:id/update').
 * @property {Array} handler - Array of handler functions for the route.
 */
const studentRoutes = [
    {
        method: 'post',
        path: '/create',
        handler: [
            isAuthenticated,
            ensureRoles(["admin"]),
            profileUploader.single('profilePicture'),
            validateStudent,
            StudentController.createStudent
        ]
    },
    {
        method: 'get',
        path: '/list',
        handler: [StudentController.getStudents]
    },
    {
        method: 'get',
        path: '/:id',
        handler: [StudentController.getStudent]
    },
    {
        method: 'patch',
        path: '/:id/update',
        handler: [
            isAuthenticated,
            ensureRoles(["admin"]),
            profileUploader.single('profilePicture'),
            StudentController.updateStudent
        ]
    },
    {
        method: 'delete',
        path: '/:id/delete',
        handler: [
            isAuthenticated,
            ensureRoles(["admin"]),
            StudentController.deleteStudent
        ]
    }
];

/**
 * Registers student-related routes with the Express router.
 *
 * This function iterates over the `studentRoutes` array and registers each route with the corresponding HTTP method and path.
 * The `registerRoutes` utility function is used to handle the registration process.
 */
registerRoutes(router, studentRoutes);

export default router;
