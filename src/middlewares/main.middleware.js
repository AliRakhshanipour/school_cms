import e from "express";
import morgan from "morgan";
import path from "path"
import cors from 'cors'

export const middlewares = [
    e.static(path.join(process.cwd(), 'public')),
    e.json(),
    e.urlencoded({ extended: true }),
    morgan("dev"),
    cors()
]