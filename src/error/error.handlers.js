import { Error_Msg } from '../utils/error.messages.js';

// 404 Error Handler
const notFoundHandler = (req, res, next) => {
    res.status(404).json({
        status: 404,
        message: Error_Msg.NOT_FOUND_PAGE,
    });
};

// Internal Server Error (500) Handler
const internalServerErrorHandler = (err, req, res, next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || err.msg || Error_Msg.INTERNAL_SERVER_ERROR;

    res.status(status).json({
        status,
        message,
    });
};

export const ErrorHandlers = [
    internalServerErrorHandler,
    notFoundHandler,
];
