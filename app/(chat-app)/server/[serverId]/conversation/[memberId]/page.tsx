import Chat from "@/app/components/chat/chat";
import ChatArea from "@/app/components/chat/group-chat-area";
import ChatHeader from "@/app/components/chat/chat-header";
import ChatInput from "@/app/components/chat/chat-input";
import ChatWindow from "@/app/components/chat/chat-window";
import { fetchFirstMembeById, initializeConversation } from "@/app/lib/actions";
import { notFound } from "next/navigation";
import ConversationChatArea from "@/app/components/friend/conversation-chat-area";

export default async function Page({ params }: { params: { serverId: string, memberId: string } }) {
    const serverId = params.serverId
    const profileId = params.memberId
    const { other, conversationId } = await initializeConversation(serverId, profileId)
    const currentMember = await fetchFirstMembeById(serverId)
    if (!other || !currentMember) {
        return notFound()
    }
    const me = currentMember.profile
    return (
        <Chat>
            <ChatHeader type='CONVERSATION' member={other}></ChatHeader>
            <ChatWindow>
                <ConversationChatArea other={other} me={me} conversationId={conversationId} />
                <ChatInput params={{ conversationId, serverId, senderId: currentMember.profile.profileId, recieverId: other.profileId }} type='CONVERSATION' placeholder={`Message #${other.name}`} />
            </ChatWindow>
        </Chat>
    )
}
