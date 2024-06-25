import { fetchFirstMembeById, initializeConversation } from "@/app/lib/actions"
import { notFound } from "next/navigation"
import ChatWindow from "./chat-window"
import ConverSationChatArea from "../friend/conversation-chat-area"
import ChatInput from "./chat-input"

export default async function ServerConversationWrapper({
    serverId,
    memberId
}: {
    serverId: string,
    memberId: string
}) {
    const { other, conversationId } = await initializeConversation(serverId, memberId)
    const currentMember = await fetchFirstMembeById(serverId)
    if (!other || !currentMember) {
        return notFound()
    }
    const me = currentMember.profile
    return (
        <ChatWindow type='CONVERSATION' conversationId={conversationId}>
            <ConverSationChatArea other={other} me={me} conversationId={conversationId} />
            <ChatInput params={{ conversationId, serverId, senderId: currentMember.profile.profileId, recieverId: other.profileId }} type='SERVER_CONVERSATION' placeholder={`Message #${other.name}`} />
        </ChatWindow>
    )
}
