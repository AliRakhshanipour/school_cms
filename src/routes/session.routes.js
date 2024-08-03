import { Router } from 'express';
import { SessionController } from '../controllers/session/session.controller.js';
import { AuthorizeMiddleware } from '../middlewares/auth/auth.middlewares.js';
import { registerRoutes } from '../utils/router-registrar.js';

const router = Router();

const { isAuthenticated, ensureRoles } = AuthorizeMiddleware;

/**
 * Array of route configurations for session-related operations.
 *
 * @constant
 * @type {Array}
 * @property {string} method - HTTP method for the route (e.g., 'post', 'get', 'patch', 'delete').
 * @property {string} path - Path for the route (e.g., '/create', '/list', '/:id/update').
 * @property {Array<Function>} [middlewares] - Optional array of middleware functions to apply to the route.
 * @property {Array<Function>} handler - Array of handler functions for the route.
 */
const sessionRoutes = [
  {
    method: 'post',
    path: '/create',
    middlewares: [],
    handler: [SessionController.createSession],
  },
  {
    method: 'get',
    path: '/list',
    handler: [SessionController.getSessions],
  },
  {
    method: 'get',
    path: '/:id',
    handler: [SessionController.getSession],
  },
  {
    method: 'patch',
    path: '/:id/update',
    middlewares: [],
    handler: [SessionController.updateSession],
  },
  {
    method: 'delete',
    path: '/:id/delete',
    middlewares: [],
    handler: [SessionController.deleteSession],
  },
];

/**
 * Registers session-related routes with the Express router.
 *
 * This function iterates over the `sessionRoutes` array and registers each route with the corresponding HTTP method and path.
 * The `registerRoutes` utility function is used to handle the registration process.
 */
registerRoutes(router, sessionRoutes);

export default router;
