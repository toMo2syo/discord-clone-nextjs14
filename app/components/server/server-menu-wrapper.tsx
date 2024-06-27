import { notFound } from "next/navigation";
import ServerMenu from "./server-menu";
import { fetchProfileByServerId, fetchRoleByServerId } from "@/app/lib/actions";

export default async function ServerMenuWrapper({ serverId }: { serverId: string }) {
    const [profile, role] = await Promise.all([
        fetchProfileByServerId(serverId),
        fetchRoleByServerId(serverId),
    ])
    if (!profile || !role) {
        return notFound()
    }
    return (
        <ServerMenu profile={profile} role={role} />
    )
}
