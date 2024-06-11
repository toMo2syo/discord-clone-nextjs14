import { fetchInitialChannel } from "@/app/lib/actions"
import { notFound, redirect } from "next/navigation"
export default async function Page({ params }: { params: { serverId: string } }) {
    const channel = await fetchInitialChannel(params.serverId)
    if (!channel) {
        return notFound()
    } else {
        redirect(`/server/${params.serverId}/${channel.channelId}`)
    }
}
