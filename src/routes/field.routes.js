import { Router } from 'express';
import { AuthorizeMiddleware } from '../middlewares/auth/auth.middlewares.js';
import { RoomController } from '../controllers/room/room.controller.js';
import { registerRoutes } from '../utils/router-registrar.js';

const router = Router();

const { isAuthenticated, ensureRoles, ensureRolesOrSuperuser } = AuthorizeMiddleware;

/**
 * Array of route configurations for room-related operations.
 *
 * @constant
 * @type {Array}
 * @property {string} method - HTTP method for the route (e.g., 'post', 'get', 'patch', 'delete').
 * @property {string} path - Path for the route (e.g., '/create', '/list', '/:id/update').
 * @property {Array<Function>} [middlewares] - Optional array of middleware functions to apply to the route.
 * @property {Array<Function>} handler - Array of handler functions for the route.
 */
const roomRoutes = [
    {
        method: 'post',
        path: '/create',
        middlewares: [
            isAuthenticated,
            ensureRoles('admin'), // Ensure only users with 'admin' role can create rooms
        ],
        handler: [
            RoomController.createRoom
        ]
    },
    {
        method: 'get',
        path: '/list',
        middlewares: [
            isAuthenticated,
            ensureRolesOrSuperuser('admin', 'superuser'), // Ensure only 'admin' or 'superuser' can list rooms
        ],
        handler: [
            RoomController.getRooms
        ]
    },
    {
        method: 'get',
        path: '/:id',
        middlewares: [
            isAuthenticated,
            ensureRolesOrSuperuser('admin', 'superuser'), // Ensure only 'admin' or 'superuser' can retrieve room details
        ],
        handler: [
            RoomController.getRoom
        ]
    },
    {
        method: 'patch',
        path: '/:id/update',
        middlewares: [
            isAuthenticated,
            ensureRoles('admin'), // Ensure only users with 'admin' role can update rooms
        ],
        handler: [
            RoomController.updateRoom
        ]
    },
    {
        method: 'delete',
        path: '/:id/delete',
        middlewares: [
            isAuthenticated,
            ensureRoles('admin'), // Ensure only users with 'admin' role can delete rooms
        ],
        handler: [
            RoomController.deleteRoom
        ]
    }
];

/**
 * Registers room-related routes with the Express router.
 *
 * This function iterates over the `roomRoutes` array and registers each route with the corresponding HTTP method and path.
 * The `registerRoutes` utility function is used to handle the registration process.
 */
registerRoutes(router, roomRoutes);

export default router;
