import Chat from "@/app/components/chat/chat"
import GroupChatArea from "@/app/components/chat/group-chat-area"
import ChatHeader from "@/app/components/chat/chat-header"
import ChatInput from "@/app/components/chat/chat-input"
import ChatWindow from "@/app/components/chat/chat-window"
import { fetchChannelById, fetchFirstMembeById } from "@/app/lib/actions"
import { notFound } from "next/navigation"

export default async function page({ params }: { params: { serverId: string, channelId: string } }) {
    const serverId = params.serverId
    const channelId = params.channelId
    const [channel, member] = await Promise.all([
        fetchChannelById(channelId),
        fetchFirstMembeById(serverId)
    ])
    if (!channel || !member) {
        notFound()
    }
    return (
        <Chat>
            <ChatHeader type='CHANNEL' channel={channel}></ChatHeader>
            <ChatWindow>
                <GroupChatArea type="CHANNEL" channel={channel} currentMember={member!} />
                <ChatInput type='CHANNEL' params={{ serverId, channelId }} placeholder={`Message #${channel.channelName}`} />
            </ChatWindow>
        </Chat>
    )
}

