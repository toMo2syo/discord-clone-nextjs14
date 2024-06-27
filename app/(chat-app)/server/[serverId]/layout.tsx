import ChannelListWrapper from "@/app/components/server/channel/channel-list-wrapper";
import MemberProfileList from "@/app/components/server/channel/member-profile-list";
import SearchWrapper from "@/app/components/server/search-wrapper";
import ServerAsidePanel from "@/app/components/server/server-aside-panel";
import ServerMenuWrapper from "@/app/components/server/server-menu-wrapper";
import { ChannelConversationSearchSkeleton, ChannelTypeListSkeleton, MemberProfileListSkeleton, ServerMenuSkeleton } from "@/app/components/skeletons";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ReactNode, Suspense } from "react";
export default function Layout({ params, children }: { params: { serverId: string }, children: ReactNode }) {
    return <>
        <ServerAsidePanel>
            <Suspense fallback={<ServerMenuSkeleton />}>
                <ServerMenuWrapper serverId={params.serverId} />
            </Suspense>
            <Suspense fallback={<ChannelConversationSearchSkeleton />}>
                <SearchWrapper serverId={params.serverId} />
            </Suspense>
            <ScrollArea className="h-[calc(100vh-100px)]">
                <Suspense fallback={<ChannelTypeListSkeleton />}>
                    <ChannelListWrapper serverId={params.serverId} />
                </Suspense>
                <Suspense fallback={<MemberProfileListSkeleton />}>
                    <MemberProfileList serverId={params.serverId} />
                </Suspense>
            </ScrollArea>
        </ServerAsidePanel>
        {children}
    </>
}
