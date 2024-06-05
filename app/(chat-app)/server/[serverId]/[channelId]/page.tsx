import ChatArea from "@/app/components/server/chat-area";
import { fetchChannelById } from "@/app/lib/actions";
import { currentProfile } from "@/app/lib/current-profile";
import { db } from "@/app/lib/db";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
export default async function page({ params }: { params: { serverId: string, channelId: string } }) {
    const profile = await currentProfile()
    if (!profile) {
        return auth().redirectToSignIn()
    }
    const channel = await fetchChannelById(params.channelId)
    const member = await db.serverMembership.findFirst({
        where: {
            serverId: params.serverId,
            profileId: profile.profileId
        }
    })
    if (!channel || !member) {
        notFound()
    }
    return (
        <ChatArea channel={channel} />
    )
}
