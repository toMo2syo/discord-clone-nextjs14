import Chat from "@/app/components/chat/chat";
import ChatArea from "@/app/components/chat/chat-area";
import ChatHeader from "@/app/components/chat/chat-header";
import ChatInput from "@/app/components/chat/chat-input";
import ChatWindow from "@/app/components/chat/chat-window";
import { initializeConversation } from "@/app/lib/actions";

export default async function Page({ params }: { params: { serverId: string, memberId: string } }) {
    const serverId = params.serverId
    const profileId = params.memberId
    const other = await initializeConversation(serverId, profileId)
    return (
        <Chat>
            <ChatHeader type='CONVERSATION' member={other}></ChatHeader>
            <ChatWindow>
                {/* <ChatArea /> */}
                <ChatInput params={{ serverId, profileId }} type='CONVERSATION' placeholder={`Message #${other.name}`} />
            </ChatWindow>
        </Chat>
    )
}
