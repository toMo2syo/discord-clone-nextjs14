//server.ts
import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import { parse } from 'cookie';
import { createClerkClient } from "@clerk/clerk-sdk-node";
import { db } from "./lib/db";
import { ServerRoleType } from "@prisma/client";

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
                console.log('session:', session)
                if (session) {
                    const currentProfile = await db.profile.findUnique({
                        where: {
                            profileId: session.sub
                        }
                    })
                    if (!currentProfile) {
                        next(new Error('Unthenticated'))
                    }
                    socket.data.userId = session.sub;
                    console.log(currentProfile);
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


        //group message
        socket.on('group message', async (data, callback) => {
            const { type, content, fileUrl = null, serverId, channelId } = data;
            console.log(data)
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
                const channelKey = `chat:${channelId}:messages`

                // Broadcast the message to other connected clients in the server
                console.log('new Message', groupMessage);

                io.emit(channelKey, groupMessage);
                callback({ status: 'success', message: 'Message sent successfully', groupMessage })

            } catch (error) {
                console.error('Error handling message event:', error);
                callback({ status: 'error', message: 'Failed to send message' });
            }

        });

        //update and delete group message
        socket.on('update group message', async (data, callback) => {
            const { serverId, channelId, messageId, content, method } = data
            console.log('update group message', { serverId, channelId, messageId, content, method })
            //add backend protection here
            if (!serverId || !channelId || !messageId || !['DELETE', 'PATCH'].includes(method)) {
                return callback({ status: 'error', message: 'Missing Params or Method Not Allowed' })
            }
            try {


                const server = await db.server.findFirst({
                    where: {
                        serverId: serverId as string,
                        memberships: {
                            some: {
                                profileId: socket.data.userId
                            }
                        }
                    },
                    include: {
                        memberships: true
                    }
                })

                if (!server) {
                    return callback({ status: 'error', message: 'Server Not Found' })
                }

                const channel = await db.channel.findFirst({
                    where: {
                        channelId: channelId as string,
                        serverId: serverId as string
                    }
                })

                if (!channel) {
                    return callback({ status: 'error', message: 'Channel Not Found' })
                }

                const member = server.memberships.find(member => member.profileId === socket.data.userId)

                if (!member) {
                    return callback({ status: 'error', message: 'Member Not Found' })
                }

                let message = await db.groupMessage.findFirst({
                    where: {
                        messageId: messageId as string,
                        channelId: channelId as string
                    },
                    include: {
                        member: {
                            include: {
                                profile: true
                            }
                        }
                    }
                })

                const isMessageOwner = message?.member.profileId === member.profileId
                const isAdmin = member.serverRole === ServerRoleType.ADMIN
                const isModerator = member.serverRole === ServerRoleType.MODERATOR
                const canUpdate = isMessageOwner || isAdmin || isModerator
                console.log('isMessageOnwer', isMessageOwner);
                console.log('isAdmin', isAdmin);
                console.log('isModerator', isModerator);

                if (!canUpdate) {
                    return callback({ status: 'error', message: 'Unauthorized' })
                }

                if (method === 'DELETE') {
                    message = await db.groupMessage.update({
                        where: {
                            messageId: messageId
                        },
                        data: {
                            fileUrl: null,
                            content: "This message has been deleted",
                            isDeleted: true
                        },
                        include: {
                            member: {
                                include: {
                                    profile: true
                                }
                            }
                        }
                    })
                }

                if (method === 'PATCH') {
                    if (!isMessageOwner) {
                        return callback({ status: 'error', message: 'Unauthorized' })
                    }
                    message = await db.groupMessage.update({
                        where: {
                            messageId: messageId
                        },
                        data: {
                            content: content
                        },
                        include: {
                            member: {
                                include: {
                                    profile: true
                                }
                            }
                        }
                    })
                }

                const updateKey = `chat:${channelId}:messages:update`
                io.emit(updateKey, message)
                callback({ status: 'success', message: 'Update Message successfully' })
            } catch (error) {
                console.error('Error handling message event', error);
                callback({ status: error, message: 'Failed to Update Message' })
            }
        })


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