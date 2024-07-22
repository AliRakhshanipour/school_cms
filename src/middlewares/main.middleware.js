import e from "express";
import morgan from "morgan";

export const middlewares = [
    e.json(),
    e.urlencoded({ extended: true }),
    morgan("dev")
]