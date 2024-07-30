import autoBind from "auto-bind";
import { models } from "../../models/index.js";
import { request, response } from "express";
import { StatusCodes } from "http-status-codes";
import { RoomMsg } from "./room.messages.js";

/**
 * RoomController handles operations related to Room entities.
 */
export const RoomController = (() => {
    class RoomController {
        #model;

        /**
         * Creates an instance of RoomController.
         */
        constructor() {
            autoBind(this);
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


    }

    return new RoomController();
})();
