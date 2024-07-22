/**
 * Registers a list of routes on a given Express router.
 * 
 * This function iterates over an array of route definitions and applies them
 * to the provided router. Each route definition should specify the HTTP method,
 * the path, and the handlers to be used for that route.
 * 
 * @param {import('express').Router} router - The Express Router instance to which the routes will be registered.
 * @param {Array<Object>} routes - An array of route definitions.
 * @param {string} routes[].method - The HTTP method for the route (e.g., 'get', 'post', 'put', 'delete').
 * @param {string} routes[].path - The path for the route (e.g., '/users', '/posts/:id').
 * @param {Array<Function>} routes[].handler - An array of middleware functions and route handlers for the route.
 * 
 * @example
 * import { Router } from 'express';
 * import { getUser, createUser } from './controllers/userController.js';
 * import { authenticate } from './middlewares/authMiddleware.js';
 * import { registerRoutes } from './routeRegistrar.js';
 * 
 * const router = Router();
 * 
 * const userRoutes = [
 *   { method: 'get', path: '/:id', handler: [authenticate, getUser] },
 *   { method: 'post', path: '/', handler: [authenticate, createUser] }
 * ];
 * 
 * registerRoutes(router, userRoutes);
 * 
 * export default router;
 */
export const registerRoutes = (router, routes) => {
    routes.forEach(route => {
        router[route.method](route.path, ...route.handler);
    });
};
