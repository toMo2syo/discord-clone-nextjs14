import ChatArea from "@/app/components/server/chat-area";
import { fetchChannelById } from "@/app/lib/actions";
import { notFound } from "next/navigation";
export default async function page({ params }: { params: { channelId: string } }) {
    const channel = await fetchChannelById(params.channelId)
    if (!channel) {
        notFound()
    }
    return (
        <ChatArea channel={channel} />
    )
}
