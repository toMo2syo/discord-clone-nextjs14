import { joinServer } from "@/app/lib/actions"
import { redirect } from "next/navigation"

export default async function page({ params }: { params: { inviteCode: string } }) {
    const server = await joinServer(params.inviteCode)
    return redirect(`/server/${server?.serverId}`)
}
