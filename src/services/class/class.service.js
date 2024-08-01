import { request, response } from "express";
import { models } from "../../models/index.js";
import BaseService from "../base.service.js";
import { StatusCodes } from "http-status-codes";
import { ClassMsg } from "../../controllers/class/class.messages.js";

export const ClassService = (() => {
    class ClassService extends BaseService {
        #model = models.Class;
        #studentModel = models.Student;

        /**
         * Updates the capacity of a class identified by its ID.
         * 
         * @async
         * @function
         * @param {Object} req - Express request object.
         * @param {Object} res - Express response object.
         * @param {Function} next - Express next middleware function.
         * @returns {Promise<void>}
         * 
         * @throws {Error} If there is an issue updating the class capacity.
         * 
         * @description
         * This function handles updating the capacity of a class identified by its ID. 
         * The new capacity is validated to ensure it is a positive integer and does not 
         * result in inconsistency with the number of students enrolled.
         */
        async changeCapacity(req = request, res = response, next) {
            try {
                const { id: classId } = req.params;
                const { newCapacity } = req.body;

                // Validate new capacity
                if (!Number.isInteger(newCapacity) || newCapacity <= 0) {
                    return res.status(StatusCodes.BAD_REQUEST).json({
                        success: false,
                        message: ClassMsg.INVALID_CAPACITY(),
                        errors: [{ message: ClassMsg.INVALID_CAPACITY(), path: "new_capacity" }]
                    });
                }

                // Find the class
                const classInstance = await this.#model.findByPk(classId);
                if (!classInstance) {
                    return res.status(StatusCodes.NOT_FOUND).json({
                        success: false,
                        message: ClassMsg.NOT_FOUND(classId),
                        errors: [{ message: ClassMsg.NOT_FOUND(classId), path: "not_found_classId" }]
                    });
                }

                // Check if the new capacity is less than the number of enrolled students
                const studentCount = await this.#studentModel.count({ where: { classId } });
                if (newCapacity < studentCount) {
                    return res.status(StatusCodes.BAD_REQUEST).json({
                        success: false,
                        message: ClassMsg.CAPACITY_TOO_LOW(studentCount),
                        errors: [{ message: ClassMsg.CAPACITY_TOO_LOW(studentCount), path: "new_capacity" }]
                    });
                }

                // Update the class capacity
                classInstance.capacity = newCapacity;
                await classInstance.save();

                res.status(StatusCodes.OK).json({
                    success: true,
                    message: ClassMsg.CAPACITY_UPDATED(classId, newCapacity),
                    class: classInstance
                });
            } catch (error) {
                next(error);
            }
        }
        /**
         * Adds students to a class by their IDs or national codes.
         * Ensures that a student cannot be added to more than one class and the class is not full.
         * 
         * @async
         * @function
         * @param {Object} req - Express request object.
         * @param {Object} res - Express response object.
         * @param {Function} next - Express next middleware function.
         * @returns {Promise<void>}
         * 
         * @throws {Error} If there is an issue adding the students.
         * 
         * @description
         * This function adds students to a class identified by its ID. 
         * It validates that each student is not already assigned to another class 
         * and that the students exist in the database before adding them to the class.
         */
        async addStudentsToClass(req = request, res = response, next) {
            try {
                const { id: classId } = req.params;
                let { studentIds = [], nationalCodes = [] } = req.body;

                // Normalize and validate studentIds and nationalCodes
                studentIds = this.#normalizeArray(studentIds);
                nationalCodes = this.#normalizeArray(nationalCodes, true);

                // Validate input
                if (studentIds.length === 0 && nationalCodes.length === 0) {
                    return res.status(StatusCodes.BAD_REQUEST).json({
                        success: false,
                        message: "Invalid input. At least one of 'studentIds' or 'nationalCodes' must be provided.",
                        errors: [{ message: "No student identifiers provided", path: "input" }]
                    });
                }

                // Find the class
                const classInstance = await this.#model.findByPk(classId);
                if (!classInstance) {
                    return res.status(StatusCodes.NOT_FOUND).json({
                        success: false,
                        message: ClassMsg.NOT_FOUND(classId),
                        errors: [{ message: ClassMsg.NOT_FOUND(classId), path: "not_found_classId" }]
                    });
                }

                // Check if the class is full
                const isFull = await this.#model.isClassFull(classId);
                if (isFull) {
                    return res.status(StatusCodes.BAD_REQUEST).json({
                        success: false,
                        message: "Class is full. Cannot add more students.",
                        errors: [{ message: "Class is full", path: "class_capacity" }]
                    });
                }

                // Fetch existing students
                const allStudents = await this.#fetchStudents(studentIds, nationalCodes);
                const existingStudentIds = new Set(allStudents.map(student => student.id));
                const existingNationalCodes = new Set(allStudents.map(student => student.national_code));

                // Filter out non-existing students
                studentIds = studentIds.filter(id => existingStudentIds.has(id));
                nationalCodes = nationalCodes.filter(code => existingNationalCodes.has(code));

                // If no valid students are left after filtering
                if (studentIds.length === 0 && nationalCodes.length === 0) {
                    return res.status(StatusCodes.BAD_REQUEST).json({
                        success: false,
                        message: "No valid students found to add to the class.",
                        errors: [{ message: "All provided student IDs or national codes are invalid.", path: "students" }]
                    });
                }

                // Fetch and deduplicate students
                const uniqueStudentIds = Array.from(new Set(allStudents.map(student => student.id)));

                // Check if students are already enrolled in another class
                const studentsAlreadyEnrolled = await this.#checkEnrollment(uniqueStudentIds, classId);
                if (studentsAlreadyEnrolled.length > 0) {
                    return res.status(StatusCodes.BAD_REQUEST).json({
                        success: false,
                        message: "Some students are already enrolled in another class.",
                        errors: studentsAlreadyEnrolled.map(student => ({
                            message: `Student with ID ${student.id} is already enrolled in class ${student.class.id}.`,
                            path: "student_enrollment"
                        }))
                    });
                }

                // Add students to the class
                await this.#studentModel.update(
                    { classId },
                    { where: { id: uniqueStudentIds } }
                );

                res.status(StatusCodes.OK).json({
                    success: true,
                    message: `Students added to class with ID ${classId}.`,
                    students: uniqueStudentIds
                });
            } catch (error) {
                next(error);
            }
        }

        /**
         * Removes a student from a class and sets the classId to null.
         * 
         * @async
         * @function
         * @param {Object} req - Express request object.
         * @param {Object} res - Express response object.
         * @param {Function} next - Express next middleware function.
         * @returns {Promise<void>}
         * 
         * @throws {Error} If there is an issue removing the student from the class.
         * 
         * @description
         * This function handles removing a student from a class identified by their IDs.
         * The student's classId is set to null to indicate they are no longer enrolled in the class.
         */
        async removeStudentFromClass(req = request, res = response, next) {
            try {
                const { id: classId, studentId } = req.params;

                // Convert IDs to integers for reliable comparison
                const classIdInt = parseInt(classId, 10);
                const studentIdInt = parseInt(studentId, 10);

                // Find the class
                const classInstance = await this.#model.findByPk(classIdInt);
                if (!classInstance) {
                    return res.status(StatusCodes.NOT_FOUND).json({
                        success: false,
                        message: ClassMsg.NOT_FOUND(classIdInt),
                        errors: [{ message: ClassMsg.NOT_FOUND(classIdInt), path: "classId" }]
                    });
                }

                // Find the student
                const studentInstance = await this.#studentModel.findByPk(studentIdInt);
                if (!studentInstance) {
                    return res.status(StatusCodes.NOT_FOUND).json({
                        success: false,
                        message: `Student with ID ${studentIdInt} not found.`,
                        errors: [{ message: `Student with ID ${studentIdInt} not found.`, path: "studentId" }]
                    });
                }

                // Check if the student is enrolled in the class
                if (studentInstance.classId !== classIdInt) {
                    return res.status(StatusCodes.BAD_REQUEST).json({
                        success: false,
                        message: `Student with ID ${studentIdInt} is not enrolled in class with ID ${classIdInt}.`,
                        errors: [{ message: `Student with ID ${studentIdInt} is not enrolled in class with ID ${classIdInt}.`, path: "studentId" }]
                    });
                }

                // Remove the student from the class
                studentInstance.classId = null;
                await studentInstance.save();

                res.status(StatusCodes.OK).json({
                    success: true,
                    message: `Student with ID ${studentIdInt} removed from class with ID ${classIdInt} successfully.`,
                });
            } catch (error) {
                next(error);
            }
        }

        /**
         * Normalizes input arrays from various formats.
         * 
         * @private
         * @param {any} input - Input data to be normalized.
         * @param {boolean} isString - Indicates if the input is expected to be a string.
         * @returns {Array} - Normalized array.
         */
        #normalizeArray(input, isString = false) {
            if (isString && typeof input === 'string') {
                return input.split(',').map(code => code.trim()).filter(code => code.length > 0);
            }
            if (typeof input === 'string') {
                return input.split(',').map(id => parseInt(id, 10)).filter(id => !isNaN(id));
            }
            return Array.isArray(input) ? input : [];
        }

        /**
         * Fetches students by their IDs and national codes.
         * 
         * @private
         * @param {Array<number>} studentIds - List of student IDs.
         * @param {Array<string>} nationalCodes - List of student national codes.
         * @returns {Promise<Array>} - List of students.
         */
        async #fetchStudents(studentIds, nationalCodes) {
            const [studentsById, studentsByCode] = await Promise.all([
                this.#studentModel.findAll({ where: { id: studentIds } }),
                this.#studentModel.findAll({ where: { national_code: nationalCodes } })
            ]);
            return [...studentsById, ...studentsByCode];
        }

        /**
         * Checks if students are already enrolled in another class.
         * 
         * @private
         * @param {Array<number>} studentIds - List of student IDs.
         * @param {number} classId - ID of the class.
         * @returns {Promise<Array>} - List of students already enrolled in another class.
         */
        async #checkEnrollment(studentIds, classId) {
            const enrolledStudents = await this.#studentModel.findAll({
                where: { id: studentIds },
                include: [{ model: this.#model, as: 'Class' }]
            });
            return enrolledStudents.filter(student => student.class && student.class.id !== classId);
        }

    }

    return new ClassService();
})();
