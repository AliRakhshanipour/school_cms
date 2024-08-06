import Joi from 'joi';

const ATTENDANCE_STATUS = ['present', 'delay', 'absent'];

export const attendanceValidationSchema = Joi.object({
  studentId: Joi.number().integer().required().messages({
    'number.base': 'studentId must be a number',
    'number.integer': 'studentId must be an integer',
    'any.required': 'studentId is required',
  }),
  sessionId: Joi.number().integer().required().messages({
    'number.base': 'sessionId must be a number',
    'number.integer': 'sessionId must be an integer',
    'any.required': 'sessionId is required',
  }),
  status: Joi.string()
    .valid(...ATTENDANCE_STATUS)
    .required()
    .messages({
      'any.only': `status must be one of ${ATTENDANCE_STATUS.join(', ')}`,
      'any.required': 'status is required',
    }),
  delayMinutes: Joi.when('status', {
    is: 'delay',
    then: Joi.number().integer().min(0).required().messages({
      'number.base': 'delayMinutes must be a number',
      'number.integer': 'delayMinutes must be an integer',
      'number.min': 'delayMinutes must be at least 0',
      'any.required': 'delayMinutes is required when status is delay',
    }),
    otherwise: Joi.forbidden().messages({
      'any.unknown': 'delayMinutes is only allowed when status is delay',
    }),
  }),
});
