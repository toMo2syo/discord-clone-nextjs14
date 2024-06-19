import { ReactNode } from "react";
import SideBar from "../components/sidebar";
import { fetchServers } from "../lib/actions";
import { initialProfile } from "../lib/current-profile";

export default async function layout({ children }: {
    children: ReactNode,
}) {
    const profile = await initialProfile()
    const servers = await fetchServers()

    return (
        <div className="flex h-screen w-screen">
            <SideBar servers={servers} />
            {children}
        </div>
    )
}
