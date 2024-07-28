'use strict'

import autoBind from "auto-bind"
import { models } from "../../models/index.js"
import { request, response } from "express"

export const FieldController = (() => {
    class FieldController {
        #model
        #imageModel
        constructor() {
            autoBind(this)
            this.#model = models.Field
            this.#imageModel = models.Image
        }

        async createField(req = request, res = response, next) {
            try {
                const fieldData = req.body

            } catch (error) {
                next(error)
            }
        }
    }
    return new FieldController()
})()