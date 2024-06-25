import FriendPendingList from "@/app/components/friend/friend-pending-list";
import { PendingFriendListSkeleton } from "@/app/components/skeletons";
import { Suspense } from "react";
export default function page() {
    return (
        <Suspense fallback={<PendingFriendListSkeleton />}>
            <FriendPendingList />
        </Suspense>
    )
}