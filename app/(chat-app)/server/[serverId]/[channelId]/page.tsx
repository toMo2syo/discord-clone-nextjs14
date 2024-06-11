import ChatArea from "@/app/components/server/chat-area"
import { fetchChannelById, fetchFirstMembeById } from "@/app/lib/actions"
import { notFound } from "next/navigation"

export default async function page({ params }: { params: { serverId: string, channelId: string } }) {
    const [channel, member] = await Promise.all([
        fetchChannelById(params.channelId),
        fetchFirstMembeById(params.serverId)
    ])
    if (!channel || !member) {
        notFound()
    }
    return (
        <ChatArea channel={channel} />
    )
}