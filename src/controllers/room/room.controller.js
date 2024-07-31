import { models } from "../../models/index.js";
import { request, response } from "express";
import { StatusCodes } from "http-status-codes";
import { RoomMsg } from "./room.messages.js";
import BaseController from "../base.controller.js";
import { col, fn, Op } from "sequelize";
import _ from "lodash";

/**
 * RoomController handles operations related to Room entities.
 */
export const RoomController = (() => {
    class RoomController extends BaseController {
        #model;

        /**
         * Creates an instance of RoomController.
         */
        constructor() {
            super()
            this.#model = models.Room;
        }

        /**
         * Creates a new room.
         * 
         * @param {object} req - The request object.
         * @param {object} res - The response object.
         * @param {function} next - The next middleware function.
         * @returns {Promise<void>} 
         */
        async createRoom(req = request, res = response, next) {
            try {
                const roomData = req.body;

                const room = await this.#model.create(roomData);
                if (!room) {
                    res.status(StatusCodes.BAD_REQUEST).json({
                        success: false,
                        message: RoomMsg.NOT_CREATED(),
                        errors: [{ message: RoomMsg.NOT_CREATED(), path: "create_room" }]
                    });
                    return;
                }

                res.status(StatusCodes.CREATED).json({
                    success: true,
                    message: RoomMsg.CREATED(room.dataValues.number),
                });
            } catch (error) {
                next(error);
            }
        }


        /**
         * Retrieves a room by its ID.
         * 
         * @param {object} req - The request object.
         * @param {object} res - The response object.
         * @param {function} next - The next middleware function.
         * @returns {Promise<void>}
         */
        async getRoom(req = request, res = response, next) {
            try {
                const { id: roomId } = req.params;

                if (!roomId) {
                    res.status(StatusCodes.BAD_REQUEST).json({
                        success: false,
                        message: RoomMsg.ROOM_ID_REQUIRED(),
                        errors: [{ message: RoomMsg.ROOM_ID_REQUIRED(), path: 'room_id_required' }]
                    });
                    return;
                }

                const room = await this.#model.findByPk(roomId, {
                    attributes: { exclude: ['createdAt', 'updatedAt'] }
                });

                if (!room) {
                    res.status(StatusCodes.NOT_FOUND).json({
                        success: false,
                        message: RoomMsg.NOT_FOUND(roomId)
                    });
                    return;
                }

                res.status(StatusCodes.OK).json({
                    success: true,
                    room
                });
            } catch (error) {
                next(error);
            }
        }

        /**
         * Retrieves a list of rooms with optional pagination, filtering by title and number,
         * and sorting by title (alphabetically) and number (ascending or descending).
         * 
         * @param {object} req - The request object.
         * @param {object} res - The response object.
         * @param {function} next - The next middleware function.
         * @returns {Promise<void>}
         */
        async getRooms(req = request, res = response, next) {
            try {
                const { page = 1, limit = 10, title, number, sortByTitle, sortByNumber } = req.query;

                const where = {};
                if (title) {
                    where.title = { [Op.like]: `%${title}%` };
                }
                if (number) {
                    where.number = number;
                }

                const offset = (page - 1) * limit;

                // Determine sort options
                const order = [];
                if (sortByTitle) {
                    // Sorting by title
                    order.push(['title', sortByTitle]);
                }
                if (sortByNumber) {
                    // Sorting by number (ascending or descending)
                    order.push(['number', sortByNumber]);
                }

                const { count, rows: rooms } = await this.#model.findAndCountAll({
                    where,
                    attributes: {
                        exclude: ['createdAt', 'updatedAt']
                    },
                    limit: parseInt(limit),
                    offset: parseInt(offset),
                    order,
                });

                res.status(StatusCodes.OK).json({
                    success: true,
                    rooms,
                    pagination: {
                        total: count,
                        page: parseInt(page),
                        limit: parseInt(limit),
                        totalPages: Math.ceil(count / limit)
                    }
                });
            } catch (error) {
                next(error);
            }
        }


        /**
         * Updates a room by its ID.
         * 
         * @param {object} req - The request object.
         * @param {object} res - The response object.
         * @param {function} next - The next middleware function.
         * @returns {Promise<void>}
         */
        async updateRoom(req = request, res = response, next) {
            try {
                const { id: roomId } = req.params;
                const updatedRoomData = _.omitBy(req.body, value => _.isNil(value) || value === '');

                if (!roomId) {
                    res.status(StatusCodes.BAD_REQUEST).json({
                        success: false,
                        message: RoomMsg.ROOM_ID_REQUIRED(),
                        errors: [{ message: RoomMsg.ROOM_ID_REQUIRED(), path: 'room_id_required' }]
                    });
                    return;
                }

                const room = await this.#model.findByPk(roomId, {
                    attributes: { exclude: ['createdAt', 'updatedAt'] }
                });

                if (!room) {
                    res.status(StatusCodes.NOT_FOUND).json({
                        success: false,
                        message: RoomMsg.NOT_FOUND(roomId),
                    });
                    return;
                }

                await room.update(updatedRoomData);
                await room.save();

                res.status(StatusCodes.OK).json({
                    success: true,
                    message: RoomMsg.UPDATED(roomId)
                });
            } catch (error) {
                next(error);
            }
        }


        /**
         * Deletes a room by its ID.
         * 
         * @param {object} req - The request object.
         * @param {object} res - The response object.
         * @param {function} next - The next middleware function.
         * @returns {Promise<void>}
         */
        async deleteRoom(req = request, res = response, next) {
            try {
                const { id: roomId } = req.params;

                if (!roomId) {
                    res.status(StatusCodes.BAD_REQUEST).json({
                        success: false,
                        message: RoomMsg.ROOM_ID_REQUIRED(),
                        errors: [{ message: RoomMsg.ROOM_ID_REQUIRED(), path: 'room_id_required' }]
                    });
                    return;
                }

                const room = await this.#model.findByPk(roomId);
                if (!room) {
                    res.status(StatusCodes.NOT_FOUND).json({
                        success: false,
                        message: RoomMsg.NOT_FOUND(roomId),
                    });
                    return;
                }

                await room.destroy();

                res.status(StatusCodes.OK).json({
                    success: true,
                    message: RoomMsg.DELETED(roomId),
                });
            } catch (error) {
                next(error);
            }
        }
    }

    return new RoomController();
})();
