import { ReactNode } from "react";
import SideBar from "../components/sidebar";
import { fetchServers } from "../lib/actions";
import { initialProfile } from "../lib/current-profile";
import { redirect } from "next/navigation";

export default async function layout({ children }: {
    children: ReactNode,
}) {
    const profile = await initialProfile()
    if (!profile) {
        return redirect('/')
    }
    const servers = await fetchServers()

    return (
        <div className="flex h-screen w-screen">
            <SideBar servers={servers} />
            {children}
        </div>
    )
}
