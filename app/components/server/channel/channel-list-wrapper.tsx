import { fetchChannels, fetchRoleByServerId } from "@/app/lib/actions"
import ChannelListContainer from "./channel-list-container"
import { notFound } from "next/navigation"

export default async function ChannelListWrapper({ serverId }: { serverId: string }) {
    const [channels, role] = await Promise.all([
        fetchChannels(serverId),
        fetchRoleByServerId(serverId),
    ])
    if (!channels && !role) {
        return notFound()
    }
    return (
        <ChannelListContainer channels={channels} role={role} />
    )
}
