import { Router } from 'express';
import { registerRoutes } from '../utils/router-registrar.js';
import { UserController } from '../controllers/user/user.controller.js';
import { UserService } from '../services/user/user.service.js';
import { AuthorizeMiddleware } from '../middlewares/auth/auth.middlewares.js';
import profileUploader from "../utils/multer.js"
const router = Router();

const {
    isAuthenticated,
    ensureRoles,
    ensureRolesOrSuperuser } = AuthorizeMiddleware

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
    { method: 'post', path: '/create', handler: [isAuthenticated, ensureRoles(["admin"]), UserController.create] },
    { method: 'get', path: '/list', handler: [isAuthenticated, ensureRoles(["admin"]), UserController.getUsers] },
    { method: 'patch', path: '/:id/update', handler: [isAuthenticated, ensureRoles(["admin"]), UserController.update] },
    { method: 'delete', path: '/:id/delete', handler: [isAuthenticated, ensureRoles(["admin"]), UserController.delete] },
    { method: 'get', path: '/:id', handler: [isAuthenticated, ensureRoles(["admin"]), UserController.get] },
    { method: 'patch', path: '/:id/change-role', handler: [isAuthenticated, ensureRolesOrSuperuser(), UserService.changeUserRole] },
    { method: 'post', path: '/upload-profile-picture', handler: [isAuthenticated, profileUploader.single('profilePicture'), UserService.updateProfilePicture] },

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
