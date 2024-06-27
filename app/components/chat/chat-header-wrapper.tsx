import { fetchChannelById, initializeFriendConversation } from "@/app/lib/actions"
import ChatHeader from "./chat-header"
import { notFound } from "next/navigation"

export default async function ChatHeaderWrapper({
    type,
    friendId,
    channelId,
}: {
    type: 'CONVERSATION' | 'CHANNEL',
    friendId?: string,
    channelId?: string
}) {
    let other;
    let channel;
    if (type === 'CONVERSATION') {
        other = await initializeFriendConversation(friendId!)
    }

    if (type === 'CHANNEL') {
        channel = await fetchChannelById(channelId!)
    }
    if (!other && !channel) {
        return notFound()
    }
    return (
        <>
            {type === 'CONVERSATION' && (
                <ChatHeader type={type} member={other?.other} />
            )}
            {type === 'CHANNEL' && (
                <ChatHeader type={type} channel={channel!} />
            )}
        </>
    )
}
