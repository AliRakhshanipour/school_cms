import { Router } from 'express';
import { AuthorizeMiddleware } from '../middlewares/auth/auth.middlewares.js';
import imageUploader from '../utils/multer.js'
import { FieldController } from '../controllers/field/field.controller.js';
import { registerRoutes } from '../utils/router-registrar.js';

const router = Router();

const { isAuthenticated, ensureRoles, ensureRolesOrSuperuser } = AuthorizeMiddleware;

/**
 * Array of route configurations for field-related operations.
 *
 * @constant
 * @type {Array}
 * @property {string} method - HTTP method for the route (e.g., 'post', 'get', 'patch', 'delete').
 * @property {string} path - Path for the route (e.g., '/create', '/list', '/:id/update').
 * @property {Array} handler - Array of handler functions for the route.
 */
const fieldRoutes = [
    {
        method: 'post',
        path: '/create',
        handler: [
            imageUploader.array('images', 6),
            FieldController.createField
        ]
    },
    {
        method: 'get',
        path: '/list',
        handler: [
            FieldController.getFields
        ]
    },
    {
        method: 'get',
        path: '/:id',
        handler: [
            FieldController.getField
        ]
    },
    {
        method: 'patch',
        path: '/:id/update',
        handler: [
            imageUploader.none(),
            FieldController.updateField
        ]
    }
];

/**
 * Registers field-related routes with the Express router.
 *
 * This function iterates over the `fieldRoutes` array and registers each route with the corresponding HTTP method and path.
 * The `registerRoutes` utility function is used to handle the registration process.
 */
registerRoutes(router, fieldRoutes);

export default router;
