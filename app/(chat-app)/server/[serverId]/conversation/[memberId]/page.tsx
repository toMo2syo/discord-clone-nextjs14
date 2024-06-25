import Chat from "@/app/components/chat/chat";
import { Suspense } from "react";
import ChatHeaderWrapper from "@/app/components/chat/chat-header-wrapper";
import { ChatAreaSkeleton, ChatHeaderSkeleton } from "@/app/components/skeletons";
import ServerConversationWrapper from "@/app/components/chat/server-conversation-wrapper";

export default async function Page({ params }: { params: { serverId: string, memberId: string } }) {
    const serverId = params.serverId
    const memberId = params.memberId
    return (
        <Chat>
            <Suspense fallback={<ChatHeaderSkeleton type='CONVERSATION' />}>
                <ChatHeaderWrapper type='CONVERSATION' friendId={memberId} />
            </Suspense>
            <Suspense fallback={<ChatAreaSkeleton />}>
                <ServerConversationWrapper serverId={serverId} memberId={memberId} />
            </Suspense>
        </Chat>
    )
}
