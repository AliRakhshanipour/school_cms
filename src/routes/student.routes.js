import { Router } from 'express';
import { registerRoutes } from '../utils/router-registrar.js';
import { AuthorizeMiddleware } from '../middlewares/auth/auth.middlewares.js';
import profileUploader from '../utils/multer.js';
import { StudentController } from '../controllers/student/student.controller.js';
import { validateStudent } from '../middlewares/validations/student.validation.js';

const router = Router();

const { isAuthenticated, ensureRoles } = AuthorizeMiddleware;

/**
 * Array of route configurations for student-related operations.
 *
 * @constant
 * @type {Array}
 * @property {string} method - HTTP method for the route (e.g., 'post', 'get', 'patch', 'delete').
 * @property {string} path - Path for the route (e.g., '/create', '/list', '/:id/update').
 * @property {Array<Function>} [middlewares] - Optional array of middleware functions to apply to the route.
 * @property {Array<Function>} handler - Array of handler functions for the route.
 */
const studentRoutes = [
    {
        method: 'post',
        path: '/create',
        middlewares: [
            isAuthenticated,
            ensureRoles(['admin']),
            profileUploader.single('profilePicture'),
            validateStudent
        ],
        handler: [
            StudentController.createStudent
        ]
    },
    {
        method: 'get',
        path: '/list',
        handler: [
            StudentController.getStudents
        ]
    },
    {
        method: 'get',
        path: '/:id',
        handler: [
            StudentController.getStudent
        ]
    },
    {
        method: 'patch',
        path: '/:id/update',
        middlewares: [
            isAuthenticated,
            ensureRoles(['admin']),
            profileUploader.single('profilePicture')
        ],
        handler: [
            StudentController.updateStudent
        ]
    },
    {
        method: 'delete',
        path: '/:id/delete',
        middlewares: [
            isAuthenticated,
            ensureRoles(['admin'])
        ],
        handler: [
            StudentController.deleteStudent
        ]
    },
    {
        method: 'post',
        path: '/student-create',
        middlewares: [
            profileUploader.single('profilePicture'),
            validateStudent
        ],
        handler: [
            StudentController.createStudent
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
