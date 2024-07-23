import autoBind from "auto-bind"
import { models } from "../../models/index.js"
import { request, response } from "express"
import createHttpError from "http-errors"
import { UserMsg } from "../../controllers/user/user.messages.js"
import { StatusCodes } from "http-status-codes"

export const UserService = (() => {
    class UserService {
        #model
        constructor() {
            autoBind(this)
            this.#model = models.User
        }

        async changeUserRole(req = request, res = response, next) {
            try {
                const { id: userId } = req.params
                const { role } = req.body

                if (!this.#model.getRoleEnumValues().includes(role)) {
                    throw new createHttpError.BadRequest(UserMsg().INVALID_ROLE(role))
                }

                const user = await this.#model.findByPk(userId)
                if (!user) {
                    throw new createHttpError.NotFound(UserMsg().NOT_FOUND)
                }

                await user.update({ role })
                await user.save()

                res.status(StatusCodes.OK)
                    .json({
                        success: true,
                        message: UserMsg().ROLE_CHANGED(role)
                    })
            } catch (error) {
                next(error)
            }
        }
    }
    return new UserService()
})()