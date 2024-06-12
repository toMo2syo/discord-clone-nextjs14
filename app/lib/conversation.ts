import { db } from "./db";

export async function findConversaction(initiatorId: string, recieverId: string) {
    try {
        const conversation = await db.conversation.findFirst({
            where: {
                AND: [
                    { initiatorId },
                    { recieverId },
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
            reciever: conversation.reciever
        }
    } catch (error) {
        console.error("Error finding conversation:", error);
        throw error;
    }
}

export async function creatreConversation(initiatorId: string, recieverId: string) {
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
            reciever: conversation.reciever
        }
    } catch (error) {
        console.error("Error Creating Conversation:", error);
        throw error;
    }
}

export async function fetchConversation(initiatorId: string, recieverId: string) {
    try {
        let existingConversation = await findConversaction(initiatorId, recieverId) || await findConversaction(recieverId, initiatorId)
        console.log('existingConversation', existingConversation);

        if (!existingConversation) {
            const newConversation = await creatreConversation(initiatorId, recieverId)
            console.log('newConversation', newConversation);

            return newConversation
        }
        return existingConversation
    } catch (error) {
        console.error("Error Creating Conversation:", error);
        throw error;
    }
}