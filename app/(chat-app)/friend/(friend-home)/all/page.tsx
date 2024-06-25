import FriendList from "@/app/components/friend/friend-list";
import { FriendListSkeleton } from "@/app/components/skeletons";
import { Suspense } from "react";
export default function page() {
    return (
        <Suspense fallback={<FriendListSkeleton />}>
            <FriendList />
        </Suspense>
    )
}