import express from 'express';

class Server {
    #port;
    #app;
    #server; // Store the server instance

    constructor(port, app) {
        this.#port = port;
        this.#app = app;
    }

    start() {
        // Start the server and store the instance
        this.#server = this.#app.listen(this.#port, () => {
            console.log(`Server is running on http://localhost:${this.#port}`);
        });
    }

    close(callback) {
        if (this.#server) {
            this.#server.close(callback);
        } else {
            callback(); // Invoke callback immediately if no server instance exists
        }
    }
}

export default Server;
