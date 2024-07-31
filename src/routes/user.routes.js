import { Router } from 'express';
import { registerRoutes } from '../utils/router-registrar.js';
import { UserController } from '../controllers/user/user.controller.js';
import { UserService } from '../services/user/user.service.js';
import { AuthorizeMiddleware } from '../middlewares/auth/auth.middlewares.js';
import profileUploader from '../utils/multer.js';

const router = Router();

const {
    isAuthenticated,
    ensureRoles,
    ensureRolesOrSuperuser
} = AuthorizeMiddleware;

/**
 * Array of route configurations for user-related operations.
 *
 * @constant
 * @type {Array}
 * @property {string} method - HTTP method for the route (e.g., 'post', 'get', 'patch', 'delete').
 * @property {string} path - Path for the route (e.g., '/create', '/list', '/:id/update').
 * @property {Array<Function>} [middlewares] - Optional array of middleware functions to apply to the route.
 * @property {Array<Function>} handler - Array of handler functions for the route.
 */
const userRoutes = [
    {
        method: 'post',
        path: '/create',
        middlewares: [
            isAuthenticated,
            ensureRoles(['admin'])
        ],
        handler: [
            UserController.create
        ]
    },
    {
        method: 'get',
        path: '/list',
        middlewares: [
            isAuthenticated,
            ensureRoles(['admin'])
        ],
        handler: [
            UserController.getUsers
        ]
    },
    {
        method: 'patch',
        path: '/:id/update',
        middlewares: [
            isAuthenticated,
            ensureRoles(['admin'])
        ],
        handler: [
            UserController.update
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
            UserController.delete
        ]
    },
    {
        method: 'get',
        path: '/:id',
        middlewares: [
            isAuthenticated,
            ensureRoles(['admin'])
        ],
        handler: [
            UserController.get
        ]
    },
    {
        method: 'patch',
        path: '/:id/change-role',
        middlewares: [
            isAuthenticated,
            ensureRolesOrSuperuser()
        ],
        handler: [
            UserService.changeUserRole
        ]
    },
    {
        method: 'post',
        path: '/upload-profile-picture',
        middlewares: [
            isAuthenticated,
            profileUploader.single('profilePicture')
        ],
        handler: [
            UserService.updateProfilePicture
        ]
    }
];

/**
 * Registers user-related routes with the Express router.
 *
 * This function iterates over the `userRoutes` array and registers each route with the corresponding HTTP method and path.
 * Middleware functions are applied first, followed by route handlers.
 *
 * @param {Router} router - The Express Router instance.
 * @param {Array} routes - An array of route configurations.
 */

// Register routes with the Express application
registerRoutes(router, userRoutes);

export default router;
