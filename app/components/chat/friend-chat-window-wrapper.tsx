import { redirect } from "next/navigation"
import ConverSationChatArea from "../friend/conversation-chat-area"
import ChatInput from "./chat-input"
import ChatWindow from "./chat-window"
import { fetchCurrentProfile, initializeFriendConversation } from "@/app/lib/actions"

export default async function FriendChatWindowWrapper({
    type,
    friendId,
}: {
    type: 'CONVERSATION' | 'CHANNEL',
    friendId: string
}) {
    const { other, conversationId } = await initializeFriendConversation(friendId)
    const me = await fetchCurrentProfile()
    if (!me) {
        return redirect('/friend/all')
    }
    return (
        <ChatWindow type={type} conversationId={conversationId}>
            <ConverSationChatArea other={other} me={me} conversationId={conversationId} />
            <ChatInput params={{ conversationId, senderId: me.profileId, recieverId: other.profileId }} type='FRIEND_CONVERSATION' placeholder={`Message #${other.name}`} />
        </ChatWindow>
    )
}
