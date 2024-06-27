import ConversationSearch from "./conversation-search";
import ChatList from "./chat-list";
import { Suspense } from "react";
import { ChatListSkeleton, ConversationSearchSkeleton } from "../skeletons";

export default function FriendAsidePanel() {
    return (
        <div className="min-w-[232px] bg-[#f2f3f5] dark:bg-[#2b2d31] h-screen">
            <Suspense fallback={<ConversationSearchSkeleton />}>
                <ConversationSearch />
            </Suspense>
            <Suspense fallback={<ChatListSkeleton />}>
                <ChatList />
            </Suspense>
        </div>
    )
}
