import { fetchDefaultChannel } from "@/app/lib/actions"
import { redirect } from "next/navigation"

export default async function Page() {
    //get initial server when a user login
    const server = await fetchDefaultChannel()

    if (server) {
        return redirect(`/server/${server?.serverId}/${server?.channels[0].channelId}`)
    }
    return (
        <div>
            create a server
        </div>
    )
}
