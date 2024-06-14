//server.ts
import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import { parse } from 'cookie';
import { createClerkClient } from "@clerk/clerk-sdk-node";
import { db } from "./lib/db";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();


app.prepare().then(() => {
    const httpServer = createServer(handler);

    const clerkClient = createClerkClient({
        secretKey: process.env.CLERK_SECRET_KEY,
        publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
    })

    const io = new Server(httpServer, {
        cors: {
            origin: "http://localhost:3000", // Update frontend URL in production
            methods: ["GET", "POST"]
        }
    });

    //auth middleaware
    io.use(async (socket, next) => {
        const cookies = parse(socket.handshake.headers.cookie || '');
        console.log(cookies);
        const sessionToken = cookies.__session;

        //manully check authentication
        if (sessionToken) {
            try {
                const session = await clerkClient.verifyToken(sessionToken);
                console.log('session:', session);

                if (session) {
                    console.log(session.sub);
                    socket.data.userId = session.sub;
                    next();
                } else {
                    next(new Error('Invalid Session'));
                }
            } catch (error) {
                next(new Error('Unauthenticated or Invalid Session'));
            }
        } else {
            next(new Error('Unauthenticated'));
        }
    })

    io.on("connection", (socket) => {
        console.log('a user connected:', socket.data.userId);

        socket.on('group message', async (data, callback) => {
            console.log(callback);

            console.log('Received message:', data);
            const { type, content, fileUrl = null, serverId, channelId } = data;
            if (!serverId) { return callback({ status: 'error', message: 'Missing serverId' }) }
            if (!channelId) { return callback({ status: 'error', message: 'Missing channelId' }) }
            try {
                // Retrieve the server membership for the user
                const membership = await db.serverMembership.findFirst({
                    where: {
                        serverId,
                        profileId: socket.data.userId
                    }
                });

                if (!membership) {
                    return callback({ status: 'error', message: 'Member Not Found' })
                    // throw new Error('User is not a member of the server');
                }
                // Create a new GroupMessage record
                const groupMessage = await db.groupMessage.create({
                    data: {
                        content,
                        channelId,
                        fileUrl,
                        membershipId: membership.membershipId,
                    },
                    include: {
                        member: {
                            include: {
                                profile: true
                            }
                        }
                    }
                });
                console.log('Message created:', groupMessage);
                const channelKey = `chat:${channelId}:messages`

                // Broadcast the message to other connected clients in the server
                io.emit(channelKey, groupMessage);
                callback({ status: 'success', message: 'Message sent successfully', groupMessage })

            } catch (error) {
                console.error('Error handling message event:', error);
                callback({ status: 'error', message: 'Failed to send message' });
            }

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