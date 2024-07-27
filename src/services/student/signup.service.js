import autoBind from "auto-bind"
import { models } from "../../models/index.js"
import { request, response } from "express"
import { StatusCodes } from "http-status-codes"
import { StudentMsg } from "../../controllers/student/student.messages.js"


export const SignupService = () => {
    class SignupService {
        #model
        constructor() {
            autoBind(this)
            this.#model = models.Student
        }

        /**
         * Handles the signup process for a student.
         *
         * @async
         * @param {Object} req - The request object.
         * @param {Object} res - The response object.
         * @param {Function} next - The next middleware function.
         * @returns {Promise<void>}
         */
        async signupStudent(req = request, res = response, next) {
            try {
                const studentData = req.body
                const existingStudent = await this.#model.findOne({ where: { national_code: studentData.national_code } })
                if (existingStudent) {
                    res.status(StatusCodes.BAD_REQUEST).json({
                        success: false,
                        message: 'National code must be unique.',
                        errors: [{ message: StudentMsg.UNIQUE_NATIONAL_CODE(studentData.national_code), path: ['national_code'] }]
                    })
                }

                const student = await this.#model.create(studentData)
                if (!student) {
                    res.status(StatusCodes.BAD_REQUEST).json({
                        success: false,
                        message: StudentMsg.NOT_CREATED()
                    })
                }

                res.status(StatusCodes.CREATED).json({
                    success: true,
                    message: StudentMsg.CREATED(),
                    student
                })
            } catch (error) {
                next(error)
            }
        }
    }
    return new SignupService()
}