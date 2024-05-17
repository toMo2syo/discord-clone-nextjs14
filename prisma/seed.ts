import { db } from "@/app/lib/db";

async function main() {
    // Create users
    const user1 = await db.user.create({
        data: {
            username: 'user1',
            email: 'user1@example.com',
            password: 'password123',
            status: 'ONLINE',
        },
    });

    const user2 = await db.user.create({
        data: {
            username: 'user2',
            email: 'user2@example.com',
            password: 'password123',
            status: 'OFFLINE',
        },
    });

    const user3 = await db.user.create({
        data: {
            username: 'user3',
            email: 'user3@example.com',
            password: 'password123',
            status: 'IDLE',
        },
    });

    // Create a bot
    const bot = await db.bot.create({
        data: {
            botName: 'ChatBot',
            description: 'A helpful chat bot',
        },
    });

    // Create a server
    const server = await db.server.create({
        data: {
            serverName: 'Main Server',
            ownerId: user1.userId,
            description: 'This is the main server',
        },
    });

    // Create channels
    const textChannel = await db.channel.create({
        data: {
            serverId: server.serverId,
            channelName: 'general',
            channelType: 'TEXT',
        },
    });

    const voiceChannel = await db.channel.create({
        data: {
            serverId: server.serverId,
            channelName: 'voice',
            channelType: 'AUDIO',
        },
    });

    // Create server roles
    const adminRole = await db.serverRole.create({
        data: {
            serverRoletype: 'ADMIN',
        },
    });

    const moderatorRole = await db.serverRole.create({
        data: {
            serverRoletype: 'MODERATOR',
        },
    });

    // Assign roles to users in server memberships
    await db.serverMembership.create({
        data: {
            serverId: server.serverId,
            userId: user1.userId,
            serverRoleId: adminRole.serverRoleId,
        },
    });

    await db.serverMembership.create({
        data: {
            serverId: server.serverId,
            userId: user2.userId,
            serverRoleId: moderatorRole.serverRoleId,
        },
    });

    // Create messages
    await db.groupMessage.create({
        data: {
            channelId: textChannel.channelId,
            senderId: user1.userId,
            content: 'Hello everyone!',
        },
    });

    await db.groupMessage.create({
        data: {
            channelId: textChannel.channelId,
            senderId: user2.userId,
            content: 'Hi there!',
        },
    });

    // Create direct messages
    await db.directMessage.create({
        data: {
            senderId: user1.userId,
            receiverId: user2.userId,
            content: 'Hey, how are you?',
        },
    });

    await db.directMessage.create({
        data: {
            senderId: user2.userId,
            receiverId: user1.userId,
            content: 'I am good, thanks!',
        },
    });

    // Create friend requests
    await db.friendRequest.create({
        data: {
            senderId: user1.userId,
            receiverId: user3.userId,
        },
    });

    // Create bot messages
    await db.botMessage.create({
        data: {
            botId: bot.botId,
            senderId: user1.userId,
            content: 'This is a message from the bot.',
        },
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await db.$disconnect();
    });
