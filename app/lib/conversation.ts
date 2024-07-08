import { db } from "./db";

export async function findConversaction(initiatorId: string, recieverId: string) {
    try {
        const conversation = await db.conversation.findFirst({
            where: {
                OR: [
                    { initiatorId, recieverId },
                    { initiatorId: recieverId, recieverId: initiatorId }
                ]
            },
            include: {
                initiator: true,
                reciever: true,
            }
        })
        if (!conversation) {
            return null
        }
        return {
            initiator: conversation.initiator,
            reciever: conversation.reciever,
            conversationId: conversation.conversationId
        }
    } catch (error) {
        console.error("Error finding conversation:", error);
        throw error;
    }
}

export async function createConversation(initiatorId: string, recieverId: string) {
    try {
        const conversation = await db.conversation.create({
            data: {
                initiatorId,
                recieverId,
            },
            include: {
                initiator: true,
                reciever: true
            }
        })
        if (!conversation) {
            throw new Error("Fail to Create Conversation");
        }
        return {
            initiator: conversation.initiator,
            reciever: conversation.reciever,
            conversationId: conversation.conversationId,
        }
    } catch (error) {
        console.error("Error Creating Conversation:", error);
        throw error;
    }
}

export async function fetchConversation(initiatorId: string, recieverId: string) {
    try {
        let existingConversation = await findConversaction(initiatorId, recieverId)
        if (!existingConversation) {
            const newConversation = await createConversation(initiatorId, recieverId)

            return newConversation
        }
        return existingConversation
    } catch (error) {
        console.error("Error Creating Conversation:", error);
        throw error;
    }
}