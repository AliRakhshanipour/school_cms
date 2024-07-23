import { Router } from 'express';
import { registerRoutes } from '../utils/router-registrar.js';
import { AuthService } from '../services/auth/auth.service.js';

const router = Router();

/**
 * Array of route configurations for authentication-related operations.
 *
 * @constant
 * @type {Array}
 * @property {string} method - HTTP method for the route (e.g., 'post').
 * @property {string} path - Path for the route (e.g., '/register', '/verify-otp', '/login').
 * @property {Array} handler - Array of handler functions for the route.
 */
const authRoutes = [
    { method: 'post', path: '/register', handler: [AuthService.register] },
    { method: 'post', path: '/verify-otp', handler: [AuthService.verifyOTP] },
    { method: 'post', path: '/login', handler: [AuthService.login] },
];

// Register authentication routes with the Express router
registerRoutes(router, authRoutes);

export default router;
