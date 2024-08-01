import { Router } from 'express';
import { AuthorizeMiddleware } from '../middlewares/auth/auth.middlewares.js';
import { ClassController } from '../controllers/class/class.controller.js';
import { registerRoutes } from '../utils/router-registrar.js';
import { ClassService } from '../services/class/class.service.js';

const router = Router();

const { isAuthenticated, ensureRoles, ensureRolesOrSuperuser } = AuthorizeMiddleware;

/**
 * Array of route configurations for class-related operations.
 *
 * @constant
 * @type {Array}
 * @property {string} method - HTTP method for the route (e.g., 'post', 'get', 'patch', 'delete').
 * @property {string} path - Path for the route (e.g., '/create', '/list', '/:id/update').
 * @property {Array<Function>} [middlewares] - Optional array of middleware functions to apply to the route.
 * @property {Array<Function>} handler - Array of handler functions for the route.
 */
const classRoutes = [
    {
        method: 'post',
        path: '/create',
        middlewares: [
            // isAuthenticated,
            // ensureRoles('admin'),
        ],
        handler: [
            ClassController.createClass
        ]
    },
    {
        method: 'get',
        path: '/list',
        middlewares: [
            // isAuthenticated,
            // ensureRoles('admin'),
        ],
        handler: [
            ClassController.getClasses
        ]
    },
    {
        method: 'get',
        path: '/:id',
        middlewares: [
            // isAuthenticated,
            // ensureRoles('admin'),
        ],
        handler: [
            ClassController.getClass
        ]
    },
    {
        method: 'patch',
        path: '/:id/update',
        middlewares: [
            // isAuthenticated,
            // ensureRoles('admin'),
        ],
        handler: [
            ClassController.updateClass
        ]
    },
    {
        method: 'patch',
        path: '/:id/change-capacity',
        middlewares: [
            // isAuthenticated,
            // ensureRoles('admin'),
        ],
        handler: [
            ClassService.changeCapacity
        ]
    },
    {
        method: 'delete',
        path: '/:id/delete',
        middlewares: [
            // isAuthenticated,
            // ensureRoles('admin'),
        ],
        handler: [
            ClassController.deleteClass
        ]
    },
    {
        method: 'patch',
        path: '/:id/students/add',
        middlewares: [
            // isAuthenticated,
            // ensureRoles('admin'),
        ],
        handler: [
            ClassService.addStudentsToClass
        ]
    },
    {
        method: 'patch',
        path: '/:id/remove-student/:studentId',
        middlewares: [
            // isAuthenticated,
            // ensureRoles('admin'),
        ],
        handler: [
            ClassService.removeStudentFromClass
        ]
    },
];

/**
 * Registers class-related routes with the Express router.
 *
 * This function iterates over the `classRoutes` array and registers each route with the corresponding HTTP method and path.
 * The `registerRoutes` utility function is used to handle the registration process.
 */
registerRoutes(router, classRoutes);

export default router;
