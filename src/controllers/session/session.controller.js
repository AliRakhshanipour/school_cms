import { request, response } from "express"
import { models } from "../../models/index.js"
import BaseController from "../base.controller.js"
import { StatusCodes } from "http-status-codes"
import { Op } from "sequelize"
import { SessionMsg } from "./session.messages.js"

export const SessionController = (() => {
    class SessionController extends BaseController {
        #model = models.Session
        #teacherModel = models.Teacher
        #classModel = models.Class
        #studentModel = models.Student
        #roomModel = models.Room


        /**
         * Creates a new session in the system.
         * 
         * @async
         * @param {Object} req - Express request object.
         * @param {Object} res - Express response object.
         * @param {Function} next - Express next middleware function.
         * @returns {Promise<void>}
         */
        async createSession(req = request, res = response, next) {
            try {
                const { roomId, day, startTime, endTime, classId, teacherId, lesson } = req.body;

                // Validate input
                const validationErrors = this.#validateInputs({ roomId, day, startTime, endTime });
                if (validationErrors.length > 0) {
                    return res.status(StatusCodes.BAD_REQUEST).json({
                        success: false,
                        message: SessionMsg.MISSING_FIELDS(),
                        errors: validationErrors
                    });
                }

                // Check for valid day and time slot format
                const dayError = this.#validateDay(day);
                if (dayError) return res.status(StatusCodes.BAD_REQUEST).json(dayError);

                const timeSlotError = this.#validateTimeSlot(startTime, endTime);
                if (timeSlotError) return res.status(StatusCodes.BAD_REQUEST).json(timeSlotError);

                // Check for existing session overlap
                const existingSessionInRoom = await this.#checkSessionOverlapInRoom(roomId, day, startTime, endTime);
                if (existingSessionInRoom) {
                    return res.status(StatusCodes.BAD_REQUEST).json({
                        success: false,
                        message: SessionMsg.OVERLAP_DETECTED(),
                        errors: [{ message: SessionMsg.OVERLAP_DETECTED(), path: 'timeSlot' }]
                    });
                }

                // Check if class and teacher exist
                const classError = await this.#checkClassExistence(classId);
                if (classError) return res.status(StatusCodes.BAD_REQUEST).json(classError);

                const teacherError = await this.#checkTeacherExistence(teacherId);
                if (teacherError) return res.status(StatusCodes.BAD_REQUEST).json(teacherError);

                // Check for teacher overlap
                const teacherOverlapError = await this.#checkTeacherOverlap(teacherId, day, startTime, endTime);
                if (teacherOverlapError) return res.status(StatusCodes.BAD_REQUEST).json(teacherOverlapError);

                // Create the new session
                const newSession = await this.#createNewSession({ roomId, day, startTime, endTime, classId, teacherId, lesson });

                res.status(StatusCodes.CREATED).json({
                    success: true,
                    message: SessionMsg.CREATED_SUCCESS(newSession.id),
                    data: newSession
                });
            } catch (error) {
                next(error);
            }
        }


        /**
 * Retrieves a session by ID with associated data.
 * 
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>}
 */
        async getSession(req = request, res = response, next) {
            try {
                const { id: sessionId } = req.params;

                if (!sessionId) {
                    return res.status(StatusCodes.BAD_REQUEST).json({
                        success: false,
                        message: 'Session ID is required.'
                    });
                }

                // Fetch the session with associated class, teacher, and room
                const session = await this.#model.findByPk(sessionId, {
                    attributes: {
                        exclude: ['roomId', 'classId', 'teacherId', 'createdAt', 'updatedAt']
                    },
                    include: [
                        {
                            model: this.#classModel,
                            as: 'Class',
                            attributes: ['id', 'title']
                        },
                        {
                            model: this.#teacherModel,
                            as: 'Teacher',
                            attributes: ['id', 'personal_code']
                        },
                        {
                            model: this.#roomModel,
                            as: 'Room',
                            attributes: ['id', 'number']
                        }
                    ]
                });

                // Check if session was found
                if (!session) {
                    return res.status(StatusCodes.NOT_FOUND).json({
                        success: false,
                        message: `Session not found with ID ${sessionId}`
                    });
                }


                // Count the students in the associated class
                const studentCount = await this.#studentModel.count({
                    where: { classId: session.dataValues.Class.id }
                });

                // Respond with the session data and student count
                res.status(StatusCodes.OK).json({
                    success: true,
                    data: {
                        ...session.toJSON(),
                        studentCount
                    }
                });
            } catch (error) {
                next(error);
            }
        }

        /**
         * Retrieves all sessions with filtering options.
         * 
         * @async
         * @param {Object} req - Express request object.
         * @param {Object} res - Express response object.
         * @param {Function} next - Express next middleware function.
         * @returns {Promise<void>}
         */
        async getSessions(req = request, res = response, next) {
            try {
                const {
                    roomId,
                    roomNumber,
                    classId,
                    classNumber,
                    teacherId,
                    personalCode,
                    studentId,
                    nationalCode,
                    day,
                    slotTime
                } = req.query;

                const whereConditions = {};
                const includeConditions = [];

                // Add conditions for the main query if parameters are provided
                if (roomId) whereConditions.roomId = roomId;
                if (classId) whereConditions.classId = classId;
                if (teacherId) whereConditions.teacherId = teacherId;
                if (day) whereConditions.day = day;

                if (slotTime) {
                    const [startTime, endTime] = slotTime.split('-');
                    whereConditions[Op.and] = [
                        { startTime: { [Op.gte]: startTime } },
                        { endTime: { [Op.lte]: endTime } }
                    ];
                }

                // Add include conditions based on provided parameters
                if (roomNumber) {
                    includeConditions.push({
                        model: this.#roomModel,
                        as: 'Room',
                        where: { number: roomNumber },
                        attributes: ['id', 'number']
                    });
                } else {
                    includeConditions.push({
                        model: this.#roomModel,
                        as: 'Room',
                        attributes: ['id', 'number']
                    });
                }

                if (classNumber || studentId || nationalCode) {
                    const studentInclude = studentId || nationalCode ? {
                        model: this.#studentModel,
                        as: 'Students',
                        attributes: ['id'],
                        where: {
                            ...(studentId && { id: studentId }),
                            ...(nationalCode && { national_code: nationalCode })
                        }
                    } : {
                        model: this.#studentModel,
                        as: 'Students',
                        attributes: ['id']
                    };

                    includeConditions.push({
                        model: this.#classModel,
                        as: 'Class',
                        where: classNumber ? { title: classNumber } : undefined,
                        attributes: ['id', 'title'],
                        include: [studentInclude]
                    });
                } else {
                    includeConditions.push({
                        model: this.#classModel,
                        as: 'Class',
                        attributes: ['id', 'title'],
                        include: [{
                            model: this.#studentModel,
                            as: 'Students',
                            attributes: ['id']
                        }]
                    });
                }

                if (personalCode) {
                    includeConditions.push({
                        model: this.#teacherModel,
                        as: 'Teacher',
                        where: { personal_code: personalCode },
                        attributes: ['id', 'personal_code']
                    });
                } else {
                    includeConditions.push({
                        model: this.#teacherModel,
                        as: 'Teacher',
                        attributes: ['id', 'personal_code']
                    });
                }

                // Fetch the sessions with associated data
                const sessions = await this.#model.findAll({
                    where: whereConditions,
                    include: includeConditions,
                    attributes: {
                        exclude: ['roomId', 'classId', 'teacherId', 'createdAt', 'updatedAt']
                    }
                });

                if (!sessions.length) {
                    return res.status(StatusCodes.NOT_FOUND).json({
                        success: false,
                        message: 'No sessions found.'
                    });
                }

                // Format the sessions to include student count
                const formattedSessions = sessions.map(session => {
                    const sessionJson = session.toJSON();
                    sessionJson.studentCount = sessionJson.Class.Students.length;
                    delete sessionJson.Class.Students;
                    return sessionJson;
                });

                res.status(StatusCodes.OK).json({
                    success: true,
                    data: formattedSessions
                });
            } catch (error) {
                next(error);
            }
        }

        #validateInputs({ roomId, day, startTime, endTime }) {
            const missingFields = [];
            if (!roomId) missingFields.push('roomId');
            if (!day) missingFields.push('day');
            if (!startTime) missingFields.push('startTime');
            if (!endTime) missingFields.push('endTime');

            return missingFields.map(field => ({
                message: `${field} is required`,
                path: field
            }));
        }

        #validateDay(day) {
            const validDays = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday'];
            if (!validDays.includes(day)) {
                return {
                    success: false,
                    message: SessionMsg.INVALID_DAY(),
                    errors: [{ message: SessionMsg.INVALID_DAY(), path: 'day' }]
                };
            }
            return null;
        }

        #validateTimeSlot(startTime, endTime) {
            const timeSlotPattern = /^([01]\d|2[0-3]):([0-5]\d)-([01]\d|2[0-3]):([0-5]\d)$/;
            if (!timeSlotPattern.test(`${startTime}-${endTime}`)) {
                return {
                    success: false,
                    message: SessionMsg.INVALID_TIME_SLOT(),
                    errors: [{ message: SessionMsg.INVALID_TIME_SLOT(), path: 'timeSlot' }]
                };
            }
            return null;
        }

        async #checkSessionOverlapInRoom(roomId, day, startTime, endTime) {
            return this.#model.findOne({
                where: {
                    roomId,
                    day,
                    [Op.or]: [
                        {
                            startTime: {
                                [Op.between]: [startTime, endTime]
                            }
                        },
                        {
                            endTime: {
                                [Op.between]: [startTime, endTime]
                            }
                        }
                    ]
                }
            });
        }

        async #checkClassExistence(classId) {
            if (classId) {
                const classInstance = await this.#classModel.findByPk(classId);
                if (!classInstance) {
                    return {
                        success: false,
                        message: SessionMsg.CLASS_NOT_FOUND(classId),
                        errors: [{ message: SessionMsg.CLASS_NOT_FOUND(classId), path: 'classId' }]
                    };
                }
            }
            return null;
        }

        async #checkTeacherExistence(teacherId) {
            if (teacherId) {
                const teacher = await this.#teacherModel.findByPk(teacherId);
                if (!teacher) {
                    return {
                        success: false,
                        message: SessionMsg.TEACHER_NOT_FOUND(teacherId),
                        errors: [{ message: SessionMsg.TEACHER_NOT_FOUND(teacherId), path: 'teacherId' }]
                    };
                }
            }
            return null;
        }

        async #checkTeacherOverlap(teacherId, day, startTime, endTime) {
            if (teacherId) {
                const existingSessionForTeacher = await this.#model.findOne({
                    where: {
                        teacherId,
                        day,
                        [Op.or]: [
                            {
                                startTime: {
                                    [Op.between]: [startTime, endTime]
                                }
                            },
                            {
                                endTime: {
                                    [Op.between]: [startTime, endTime]
                                }
                            }
                        ]
                    }
                });

                if (existingSessionForTeacher) {
                    return {
                        success: false,
                        message: SessionMsg.TEACHER_OVERLAP_DETECTED(teacherId),
                        errors: [{ message: SessionMsg.TEACHER_OVERLAP_DETECTED(teacherId), path: 'teacherId' }]
                    };
                }
            }
            return null;
        }

        async #createNewSession({ roomId, day, startTime, endTime, classId, teacherId, lesson }) {
            return this.#model.create({
                roomId,
                day,
                startTime,
                endTime,
                classId,
                teacherId,
                lesson
            });
        }



    }


    return new SessionController()
})()