import { Sequelize } from "sequelize"
import "./dotenv-config.js"

const DB_URL = process.env.DATABASE_URL

export const sequelize = new Sequelize(DB_URL, {
    dialect: "postgres",
    logging: false
})

