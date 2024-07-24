import autoBind from "auto-bind"
import { models } from "../../models/index.js"
import { request, response } from "express"

export const StudentController = (() => {
    class StudentController {
        #model
        constructor() {
            autoBind(this)
            this.#model = models.Student
        }


        async create(req = request, res = response, next) {
            try {
                const _ = req.body
            } catch (error) {
                next(error)
            }
        }
    }
    return new StudentController()
})()