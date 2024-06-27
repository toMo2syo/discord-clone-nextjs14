import ServerStarter from "@/app/components/server/server-starter"
import { fetchDefaultChannel } from "@/app/lib/actions"
import { redirect } from "next/navigation"

export default async function Page() {
    const server = await fetchDefaultChannel()
    if (server) {
        return redirect(`/server/${server?.serverId}/${server?.channels[0].channelId}`)
    }
    return (
        <div className="w-full h-full flex-1 flex items-center justify-center">
            <ServerStarter />
        </div>
    )
}
