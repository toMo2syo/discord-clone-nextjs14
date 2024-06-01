import { getInitialServers } from "@/app/lib/actions"
import { redirect } from "next/navigation"

export default async function Page() {
    //get initial server when a user login
    const servers = await getInitialServers()
    console.log(servers);

    if (servers.length > 0) {
        return redirect(`/server/${servers[0].serverId}`)
    }
    return (
        <div>create a server</div>
    )
}
