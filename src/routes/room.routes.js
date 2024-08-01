import { Router } from 'express';
import { registerRoutes } from '../utils/router-registrar.js';
import { AuthorizeMiddleware } from '../middlewares/auth/auth.middlewares.js';
import { RoomController } from '../controllers/room/room.controller.js';

const router = Router();

const { isAuthenticated, ensureRoles } = AuthorizeMiddleware;

/**
 * Array of route configurations for room-related operations.
 *
 * @constant
 * @type {Array}
 * @property {string} method - HTTP method for the route (e.g., 'post', 'get', 'patch', 'delete').
 * @property {string} path - Path for the route (e.g., '/create', '/list', '/:id/update').
 * @property {Array} handler - Array of handler functions for the route.
 * @property {Array} middlewares - Array of middleware functions to be applied to the route.
 */
const roomRoutes = [
    {
        method: 'post',
        path: '/create',
        handler: [
            RoomController.createRoom
        ],
        middlewares: [
            // isAuthenticated,
            // ensureRoles('admin') // Restrict access to admins
        ]
    },
    {
        method: 'get',
        path: '/list',
        handler: [
            RoomController.getRooms
        ],
        middlewares: [
            // isAuthenticated,
            // ensureRoles('admin') // Restrict access to admins
        ]
    },
    {
        method: 'get',
        path: '/:id',
        handler: [
            RoomController.getRoom
        ],
        middlewares: [
            // isAuthenticated,
            // ensureRoles('admin') // Restrict access to admins
        ]
    },
    {
        method: 'patch',
        path: '/:id/update',
        handler: [
            RoomController.updateRoom
        ],
        middlewares: [
            // isAuthenticated,
            // ensureRoles('admin') 
        ]
    },
    {
        method: 'delete',
        path: '/:id/delete',
        handler: [
            // RoomController.deleteRoom
        ],
        middlewares: [
            // isAuthenticated,
            // ensureRoles('admin')
        ]
    },
];

/**
 * Registers room-related routes with the Express router.
 *
 * This function iterates over the `roomRoutes` array and registers each route with the corresponding HTTP method and path.
 * The `registerRoutes` utility function is used to handle the registration process.
 */
registerRoutes(router, roomRoutes);

export default router;
