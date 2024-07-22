class Server {
    #port;
    #app;

    constructor(port, app) {
        this.#port = port;
        this.#app = app

    }

    start() {
        this.#app.listen(this.#port, () => {
            console.log(`Server is running on http://localhost:${this.#port}`);
        });
    }
}

export default Server;
