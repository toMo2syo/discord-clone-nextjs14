import Chat from "@/app/components/chat/chat"
import { Suspense } from "react"
import ChannelChatWindowWrapper from "@/app/components/chat/channel-chat-window-wrapper"
import ChatHeaderWrapper from "@/app/components/chat/chat-header-wrapper"
import { ChatAreaSkeleton, ChatHeaderSkeleton } from "@/app/components/skeletons"

export default function page({ params }: { params: { serverId: string, channelId: string } }) {
    const serverId = params.serverId
    const channelId = params.channelId
    return (
        <Chat>
            <Suspense fallback={<ChatHeaderSkeleton type='CHANNEL' />}>
                <ChatHeaderWrapper type='CHANNEL' channelId={channelId} />
            </Suspense>
            <Suspense fallback={<ChatAreaSkeleton />}>
                <ChannelChatWindowWrapper channelId={channelId} serverId={serverId} />
            </Suspense>
        </Chat>
    )
}

