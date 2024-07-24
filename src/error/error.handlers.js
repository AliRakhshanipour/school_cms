import { Error_Msg } from '../utils/error.messages.js';
import ValidationError from '../utils/customError.js';

/**
 * Handles 404 Not Found errors.
 * 
 * @function notFoundHandler
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const notFoundHandler = (req, res, next) => {
    res.status(404).json({
        status: 404,
        message: Error_Msg.NOT_FOUND_PAGE,
    });
};

/**
 * Handles internal server errors and custom validation errors.
 * 
 * @function internalServerErrorHandler
 * @param {Object} err - The error object.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const internalServerErrorHandler = (err, req, res, next) => {
    if (err instanceof ValidationError) {
        return res.status(err.status).json({
            status: err.status,
            message: err.message,
            errors: err.errors
        });
    }

    const status = err.status || err.statusCode || 500;
    const message = err.message || err.msg || Error_Msg.INTERNAL_SERVER_ERROR;

    res.status(status).json({
        status,
        message,
    });
};

/**
 * An array of error-handling middleware functions.
 * 
 * @constant {Array<Function>} ErrorHandlers
 */
export const ErrorHandlers = [
    internalServerErrorHandler,
    notFoundHandler,
];
