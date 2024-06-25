import { fetchServers } from "@/app/lib/actions"
import Seperator from "../friend/seperator"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import ServerLink from "./server-link"

export default async function ServerList() {
    const servers = await fetchServers()
    return (
        <>
            {(servers?.length === 0) && <Seperator />}
            {(servers?.length > 0) && (
                <ScrollArea className="w-full max-h-[388px] shadow-inner">
                    <ScrollBar />
                    <nav className="flex mt-1 flex-col gap-2 items-center">
                        {servers.map(server => (
                            <ServerLink key={server.serverId} server={server} />
                        ))}
                    </nav>
                </ScrollArea>
            )}
            {(servers?.length > 0) ? (<Seperator />) : null}
        </>
    )
}
