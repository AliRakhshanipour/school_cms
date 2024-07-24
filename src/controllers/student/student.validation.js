import Joi from 'joi';

export const studentSchema = Joi.object({
    first_name: Joi.string().required().messages({
        'string.empty': 'First name is required',
        'any.required': 'First name is required'
    }),
    last_name: Joi.string().required().messages({
        'string.empty': 'Last name is required',
        'any.required': 'Last name is required'
    }),
    national_code: Joi.string().required().messages({
        'string.empty': 'National code is required',
        'any.required': 'National code is required'
    }),
    fatehr_name: Joi.string().required().messages({
        'string.empty': 'Father name is required',
        'any.required': 'Father name is required'
    }),
    fatehr_job: Joi.string().required().messages({
        'string.empty': 'Father job is required',
        'any.required': 'Father job is required'
    }),
    mother_job: Joi.string().required().messages({
        'string.empty': 'Mother job is required',
        'any.required': 'Mother job is required'
    }),
    father_education: Joi.string().valid("diplom", "bachelor", "master", "phd", "others").required().messages({
        'string.empty': 'Father education is required',
        'any.required': 'Father education is required',
        'any.only': 'Father education must be one of diplom, bachelor, master, phd, or others'
    }),
    mother_education: Joi.string().valid("diplom", "bachelor", "master", "phd", "others").required().messages({
        'string.empty': 'Mother education is required',
        'any.required': 'Mother education is required',
        'any.only': 'Mother education must be one of diplom, bachelor, master, phd, or others'
    }),
    math_grade: Joi.string().optional(),
    avg_grade: Joi.string().required().messages({
        'string.empty': 'Average grade is required',
        'any.required': 'Average grade is required'
    }),
    discipline_grade: Joi.string().required().messages({
        'string.empty': 'Discipline grade is required',
        'any.required': 'Discipline grade is required'
    }),
    // Optional profile picture field
    profilePicture: Joi.any().optional().allow(null)
});
