import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
    const httpServer = createServer(handler);

    const io = new Server(httpServer, {
        cors: {
            origin: "http://localhost:3000", // Update with your frontend URL in production
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", (socket) => {
        console.log('a user connected');
        console.log(socket);

        // Handle incoming messages
        socket.on('message', (data) => {
            console.log('Received message:', data);
            // Broadcast the message to other connected clients if needed
            io.emit('message', data);
        });

        socket.on('disconnect', () => {
            console.log('user disconnected');
        });



        // ...
    });

    httpServer
        .once("error", (err) => {
            console.error(err);
            process.exit(1);
        })
        .listen(port, () => {
            console.log(`> Ready on http://${hostname}:${port}`);
        });
});