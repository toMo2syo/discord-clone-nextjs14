import { fetchInitialChannel } from "@/app/lib/actions"
import { notFound, redirect } from "next/navigation"
import { ReactNode } from "react"
export default async function Page({ params }: { params: { serverId: string } }) {
    const channel = await fetchInitialChannel(params.serverId)
    if (!channel) {
        notFound()
    } else {
        console.log(channel);
        redirect(`/server/${params.serverId}/${channel.channelId}`)
    }
}
