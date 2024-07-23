import autoBind from "auto-bind"
import { models } from "../../models/index.js"
import { request, response } from "express"
import createHttpError from "http-errors"
import { UserMsg } from "../../controllers/user/user.messages.js"
import { StatusCodes } from "http-status-codes"
import fs from "fs"

export const UserService = (() => {
    class UserService {
        #model
        #imageModel
        constructor() {
            autoBind(this)
            this.#model = models.User
            this.#imageModel = models.Image
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



        async updateProfilePicture(req = request, res = response, next) {
            try {
                const { path: filePath, filename } = req.file;
                const user = await this.#model.findByPk(req.user.id, {
                    include: [{
                        model: models.Image,
                        where: { imageableType: 'user' },
                        required: false
                    }]
                });

                if (!user) {
                    throw new createHttpError.NotFound(UserMsg().NOT_FOUND);
                }

                const oldImage = user.Images.find(image => image.imageableType === 'user');
                if (oldImage) {
                    const oldImagePath = oldImage.url;
                    if (fs.existsSync(oldImagePath)) {
                        fs.unlinkSync(oldImagePath);
                    }
                    await oldImage.destroy();
                }

                const newImage = await models.Image.create({
                    title: `profile-pic-${req.user.username}`,
                    url: filePath,
                    imageableId: req.user.id,
                    imageableType: 'user'
                });

                res.status(StatusCodes.OK).json({
                    success: true,
                    message: UserMsg().PROFILE_PICTURE_UPDATED,
                    image: newImage
                });
            } catch (error) {
                next(error);
            }
        }
    }
    return new UserService()
})()