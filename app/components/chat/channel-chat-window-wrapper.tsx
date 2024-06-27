import { fetchChannelById, fetchFirstMembeById } from "@/app/lib/actions"
import { ChannelType } from "@prisma/client"
import { notFound } from "next/navigation"
import ChatWindow from "./chat-window"
import GroupChatArea from "./group-chat-area"
import ChatInput from "./chat-input"
import VioceWindow from "./voice-window"
import MediaRoom from "./media-room"

export default async function ChannelChatWindowWrapper({
    serverId,
    channelId,
}: {
    serverId: string,
    channelId: string
}) {
    const [channel, member] = await Promise.all([
        fetchChannelById(channelId),
        fetchFirstMembeById(serverId)
    ])
    if (!channel || !member) {
        notFound()
    }
    return (
        <>
            {
                channel.channelType === ChannelType.TEXT && (
                    <ChatWindow>
                        <GroupChatArea type="CHANNEL" channel={channel} currentMember={member!} />
                        <ChatInput type='CHANNEL' params={{ serverId, channelId }} placeholder={`Message #${channel.channelName}`} />
                    </ChatWindow>
                )
            }

            {
                channel.channelType === ChannelType.VOICE && (
                    <VioceWindow>
                        <MediaRoom chatId={channelId} video={false} audio={true} />
                    </VioceWindow>
                )
            }
        </>

    )
}
