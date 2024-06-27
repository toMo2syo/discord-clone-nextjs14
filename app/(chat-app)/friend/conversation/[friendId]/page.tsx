import Chat from "@/app/components/chat/chat";
import ChatHeaderWrapper from "@/app/components/chat/chat-header-wrapper";
import FriendChatWindowWrapper from "@/app/components/chat/friend-chat-window-wrapper";
import { ChatAreaSkeleton, ChatHeaderSkeleton } from "@/app/components/skeletons";
import { Suspense } from "react";

export default function page({ params }: { params: { friendId: string } }) {
    return (
        <Chat>
            <Suspense fallback={<ChatHeaderSkeleton type="CONVERSATION" />}>
                <ChatHeaderWrapper type='CONVERSATION' friendId={params.friendId} />
            </Suspense>
            <Suspense fallback={<ChatAreaSkeleton />}>
                <FriendChatWindowWrapper type='CONVERSATION' friendId={params.friendId} />
            </Suspense>
        </Chat>
    )
}
