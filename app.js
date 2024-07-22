import e from "express";
import Server from "./src/configs/server.conf.js";
import "./src/configs/dotenv-config.js"
import { middlewares } from "./src/middlewares/main.middleware.js";

const main = () => {
    const app = e()

    // middlewares implemented with spread method
    app.use(...middlewares)

    // routes implemented here


    // server start here
    const port = process.env.PORT || 3000
    new Server(port, app).start()
}

main()