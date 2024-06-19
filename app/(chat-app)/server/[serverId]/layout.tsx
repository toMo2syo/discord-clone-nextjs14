import ChannelListWrapper from "@/app/components/server/channel/channel-list-wrapper";
import MemberProfileList from "@/app/components/server/channel/member-profile-list";
import ServerAsidePanel from "@/app/components/server/server-aside-panel";
import ServerMenu from "@/app/components/server/server-menu";
import { fetchChannels, fetchProfileByServerId, fetchRoleByServerId, fetchServerMembersById } from "@/app/lib/actions";
import { currentProfile } from "@/app/lib/current-profile";
import { ScrollArea } from "@/components/ui/scroll-area";
import { notFound, redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function Layout({ params, children }: { params: { serverId: string }, children: ReactNode }) {
    const userProfile = await currentProfile()
    if (!userProfile) {
        return redirect('/server')
    }
    const [profile, channels, role, members] = await Promise.all([
        fetchProfileByServerId(params.serverId),
        fetchChannels(params.serverId),
        fetchRoleByServerId(params.serverId),
        fetchServerMembersById(params.serverId)
    ])

    if (!profile || !channels || !role || !members) {
        return notFound()
    }

    return <>
        <ServerAsidePanel>
            <ServerMenu profile={profile} role={role} />
            {(channels.length > 0) && <ScrollArea className="h-[calc(100vh-48px)]">
                <ChannelListWrapper channels={channels} role={role} />
                <MemberProfileList members={members} role={role} />
            </ScrollArea>
            }
        </ServerAsidePanel>
        {children}
    </>
}
