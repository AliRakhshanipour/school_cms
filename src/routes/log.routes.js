import { Router } from 'express';
import { LogService } from '../services/log/log.service.js';
import { registerRoutes } from '../utils/router-registrar.js';
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
  {
    method: 'get',
    path: '/activities',
    handler: [LogService.getAllActivities],
  },
  {
    method: 'get',
    path: '/activities/user/:id',
    handler: [LogService.getActivitiesByUserId],
  },
];

/**
 * Registers user-related routes with the Express router.
 *
 * This function iterates over the `userRoutes` array and registers each route with the corresponding HTTP method and path.
 * The `registerRoutes` utility function is used to handle the registration process.
 */
userRoutes.forEach((route) => {
  router[route.method](route.path, ...route.handler);
});

// Register routes with the Express application
registerRoutes(router, userRoutes);

export default router;
