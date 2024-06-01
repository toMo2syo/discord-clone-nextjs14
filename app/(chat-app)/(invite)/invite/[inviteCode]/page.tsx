import { joinServer } from "@/app/lib/actions"
import { notFound, redirect } from "next/navigation"

export default async function page({ params }: { params: { inviteCode: string } }) {
    const server = await joinServer(params.inviteCode)
    if (!server) {
        return notFound()
    }
    return redirect(`/server/${server.serverId}`)
}
