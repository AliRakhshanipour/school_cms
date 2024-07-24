import { studentSchema } from '../../controllers/student/student.validation.js';
import ValidationError from '../../error/custom-error.js';

/**
 * Middleware to validate the student data in the request body.
 * 
 * @function validateStudent
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {void|next} If validation fails, passes a ValidationError to the next middleware. Otherwise, calls next() to proceed.
 */
export const validateStudent = (req, res, next) => {
    // Validate the request body against the student schema
    const { error } = studentSchema.validate(req.body, { abortEarly: false });

    if (error) {
        // If validation fails, map the error details to a custom format
        const errors = error.details.map(detail => ({
            message: detail.message,
            path: detail.path
        }));
        // Pass a ValidationError to the next middleware
        return next(new ValidationError(errors));
    }

    // If validation succeeds, proceed to the next middleware
    next();
};
