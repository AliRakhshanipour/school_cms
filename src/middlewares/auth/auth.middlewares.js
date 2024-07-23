import passport from "passport";
import { AuthMiddlewareMsg } from "./auth.messages.js";
import { StatusCodes } from "http-status-codes";

/**
 * Authorization middleware for handling user authentication and role-based access control.
 * 
 * This module exports a singleton instance of the `Authorization` class, which contains middleware functions
 * to ensure that users are authenticated and have the required roles or superuser privileges.
 * 
 * @module AuthorizeMiddleware
 */
export const AuthorizeMiddleware = (() => {
    class Authorization {
        constructor() {
            // Define roles here or fetch from configuration
            this.roles = [];
        }

        /**
         * Middleware to check if the user is authenticated using JWT.
         * 
         * This middleware uses `passport` to authenticate users based on JWT. If the user is authenticated,
         * the user object is attached to the `req` object, and the next middleware function is called. If authentication
         * fails or the user is not authenticated, an appropriate error response is sent.
         * 
         * @param {Object} req - The HTTP request object.
         * @param {Object} res - The HTTP response object.
         * @param {Function} next - The next middleware function in the stack.
         */
        isAuthenticated(req, res, next) {
            passport.authenticate('jwt', { session: false }, (err, user) => {
                if (err) return next(err);
                if (!user) return res.status(StatusCodes.UNAUTHORIZED)
                    .json({ message: AuthMiddlewareMsg.NOT_AUTHENTICATED });

                // Attach user to request object
                req.user = user;
                next();
            })(req, res, next);
        }

        /**
         * Middleware to ensure that the user is a superuser.
         * 
         * This middleware checks if the user has the `isSuperuser` property set to `true`. If not, a forbidden
         * response is sent. If the user is a superuser, the request is passed to the next middleware function.
         * 
         * @returns {Function} Middleware function.
         */
        ensureRolesOrSuperuser() {
            return (req, res, next) => {
                if (!req.user || !req.user.isSuperuser) {
                    return res.status(StatusCodes.FORBIDDEN)
                        .json({
                            message: AuthMiddlewareMsg.FORBIDDEN
                        });
                }
                next();
            };
        }

        /**
         * Middleware to ensure the user has one of the required roles.
         * 
         * This middleware checks if the user is authenticated and has one of the specified roles. If the user is not
         * authenticated, or their role is not in the allowed roles array, a forbidden response is sent. If the user
         * has the required role, the request is passed to the next middleware function.
         * 
         * @param {string[]} [allowedRoles=[]] - Array of roles that are allowed to access the route.
         * @returns {Function} Middleware function.
         */
        ensureRoles(allowedRoles = []) {
            return (req, res, next) => {
                // Check if user is authenticated
                if (!req.user) return res.status(StatusCodes.UNAUTHORIZED)
                    .json({ message: AuthMiddlewareMsg.UNAUTHORIZED });

                // Check if user's role is one of the allowed roles
                if (allowedRoles.length && !allowedRoles.includes(req.user.role)) {
                    return res.status(StatusCodes.FORBIDDEN)
                        .json({ message: AuthMiddlewareMsg.FORBIDDEN });
                }

                next();
            };
        }
    }

    return new Authorization();
})();
