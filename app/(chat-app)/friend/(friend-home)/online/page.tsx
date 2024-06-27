import OnlineFriendList from "@/app/components/friend/online-friend-list";
import { OnlineFriendListSkeleton } from "@/app/components/skeletons";
import { Suspense } from "react";
export default function page() {
    return (
        <Suspense fallback={<OnlineFriendListSkeleton />}>
            <OnlineFriendList />
        </Suspense>
    )
}
