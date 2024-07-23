import { Router } from 'express';
import { registerRoutes } from '../utils/router-registrar.js';
import { UserController } from '../controllers/user/user.controller.js';

const router = Router();

/**
 * Array of route configurations for user-related operations.
 *
 * @constant
 * @type {Array}
 * @property {string} method - HTTP method for the route (e.g., 'post', 'get', 'patch', 'delete').
 * @property {string} path - Path for the route (e.g., '/create', '/list', '/:id/update').
 * @property {Array} handler - Array of handler functions for the route.
 */
const userRoutes = [
    { method: 'post', path: '/create', handler: [UserController.create] },
    { method: 'get', path: '/list', handler: [UserController.getUsers] },
    { method: 'patch', path: '/:id/update', handler: [UserController.update] },
    { method: 'delete', path: '/:id/delete', handler: [UserController.delete] },
    { method: 'get', path: '/:id', handler: [UserController.get] },
];

/**
 * Registers user-related routes with the Express router.
 *
 * This function iterates over the `userRoutes` array and registers each route with the corresponding HTTP method and path.
 * The `registerRoutes` utility function is used to handle the registration process.
 */
userRoutes.forEach(route => {
    router[route.method](route.path, ...route.handler);
});

// Register routes with the Express application
registerRoutes(router, userRoutes);

export default router;
