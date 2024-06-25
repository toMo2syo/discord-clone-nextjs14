import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import { parse } from 'cookie';
import { createClerkClient } from "@clerk/clerk-sdk-node";
import { db } from "./lib/db";
import { ServerRoleType } from "@prisma/client";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);
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
            origin: dev ? "http://localhost:3000" : process.env.NEXT_PUBLIC_SITE_URL,
            methods: ["GET", "POST"]
        }
    });

    //auth middleaware
    io.use(async (socket, next) => {
        const cookies = parse(socket.handshake.headers.cookie || '');
        const sessionToken = cookies.__session;

        //manully check authentication
        if (sessionToken) {
            try {
                const session = await clerkClient.verifyToken(sessionToken);
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
        if (socket.data.userId) {
            (async () => {
                await db.profile.update({
                    where: {
                        profileId: socket.data.userId,
                    },
                    data: {
                        status: 'ONLINE',
                        lastOnlineTime: new Date()
                    }
                })
            })()
        }
        //group message
        socket.on('group message', async (data, callback) => {
            const { content, fileUrl = null, serverId, channelId } = data;
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

        //server direct message
        socket.on('direct message', async (data, callback) => {
            const { type, content, fileUrl, conversationId, serverId, senderId, recieverId } = data;
            if (!conversationId) { return callback({ status: 'error', message: 'Missing conversationId' }) }
            if (type === 'SERVER_CONVERSATION' && !serverId) {
                return callback({ status: 'error', message: 'Missing serverId' })
            }
            if (!senderId) { return callback({ status: 'error', message: 'Missing senderId' }) }
            if (!recieverId) { return callback({ status: 'error', message: 'Missing recieverId' }) }

            try {
                // Retrieve the server membership for the user
                if (type === 'SERVER_CONVERSATION') {
                    const membership = await db.serverMembership.findFirst({
                        where: {
                            serverId,
                            profileId: socket.data.userId
                        }
                    });

                    if (!membership) {
                        return callback({ status: 'error', message: 'Member Not Found' })
                    }
                }

                if (type === 'FRIEND_CONVERSATION') {
                    // Check if the friendProfileId is a friend of the current profile
                    const friendRecord = await db.friend.findFirst({
                        where: {
                            OR: [
                                { profileId: senderId, friendProfileId: recieverId },
                                { profileId: recieverId, friendProfileId: senderId }
                            ]
                        }
                    });
                    if (!friendRecord) {
                        return callback({ status: 'error', message: 'You Are Not Friends' })
                    }
                }
                const conversation = await db.conversation.findFirst({
                    where: {
                        conversationId,

                        OR: [
                            {
                                initiatorId: socket.data.userId

                            },
                            {
                                recieverId: socket.data.userId
                            }
                        ]
                    }
                })

                if (!conversation) {
                    return callback({ status: 'error', message: 'Conversation Not Found' })
                }

                // Create a new direct message record
                const directMessage = await db.directMessage.create({
                    data: {
                        content,
                        fileUrl: fileUrl ?? null,
                        conversationId,
                        senderId,
                        recieverId
                    },
                    include: {
                        sender: true,
                        receiver: true
                    }
                });
                const serverConversationKey = `chat:${conversationId}:messages`
                // Broadcast the message to other connected clients in the server
                io.emit(serverConversationKey, directMessage)
                callback({ status: 'success', message: 'Message sent successfully', directMessage })

            } catch (error) {
                console.error('Error handling message event:', error);
                callback({ status: 'error', message: 'Failed to send message' });
            }

        });


        socket.on('disconnect', () => {
            if (socket.data.userId) {
                (async () => {
                    await db.profile.update({
                        where: {
                            profileId: socket.data.userId,
                        },
                        data: {
                            status: 'OFFLINE',
                            lastOnlineTime: new Date()
                        }
                    })
                })()
            }
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