import ChannelListWrapper from "@/app/components/server/channel/channel-chat-list";
import ServerAsidePanel from "@/app/components/server/server-aside-panel";
import ServerMenu from "@/app/components/server/server-menu";
import { fetchChannels, fetchProfileByServerId, fetchRoleByServerId } from "@/app/lib/actions";
import { notFound } from "next/navigation";
import { ReactNode } from "react";

export default async function page({ params, children }: { params: { serverId: string }, children: ReactNode }) {
    const [profile, channels, role] = await Promise.all([
        fetchProfileByServerId(params.serverId),
        fetchChannels(params.serverId),
        fetchRoleByServerId(params.serverId)
    ])
    console.log(profile);
    console.log(channels);
    console.log(role);
    if (!profile || !channels || !role) {
        return notFound()
    }
    return <>
        <ServerAsidePanel>
            <ServerMenu profile={profile} role={role} />
            {(channels.length > 0) && <ChannelListWrapper channels={channels} />}
        </ServerAsidePanel>
        {children}
    </>
}
