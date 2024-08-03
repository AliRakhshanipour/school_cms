import { Router } from 'express';
import { AuthorizeMiddleware } from '../middlewares/auth/auth.middlewares.js';
import { AuthService } from '../services/auth/auth.service.js';
import { registerRoutes } from '../utils/router-registrar.js';

const router = Router();

const { isAuthenticated, ensureRoles } = AuthorizeMiddleware;

/**
 * Array of route configurations for authentication-related operations.
 *
 * @constant
 * @type {Array}
 * @property {string} method - HTTP method for the route (e.g., 'post').
 * @property {string} path - Path for the route (e.g., '/register', '/verify-otp', '/login').
 * @property {Array<Function>} [middlewares] - Optional array of middleware functions to apply to the route.
 * @property {Array<Function>} handler - Array of handler functions for the route.
 */
const authRoutes = [
  {
    method: 'post',
    path: '/register',
    handler: [AuthService.register],
  },
  {
    method: 'post',
    path: '/verify-otp',
    handler: [AuthService.verifyOTP],
  },
  {
    method: 'post',
    path: '/login',
    handler: [AuthService.login],
  },
];

/**
 * Registers authentication-related routes with the Express router.
 *
 * This function iterates over the `authRoutes` array and registers each route with the corresponding HTTP method and path.
 * The `registerRoutes` utility function is used to handle the registration process.
 */
registerRoutes(router, authRoutes);

export default router;
