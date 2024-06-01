import { ReactNode } from "react";
import SideBar from "../components/sidebar";
import { getInitialServers } from "../lib/actions";

export default async function layout({ children }: { children: ReactNode }) {
    const servers = await getInitialServers()
    console.log(servers);

    return (
        <div className="flex h-screen w-screen">
            <SideBar servers={servers} />
            {children}
        </div>
    )
}
