import { ReactNode } from "react";
import SideBar from "../components/sidebar";
import { fetchServers } from "../lib/actions";
import { auth } from "@clerk/nextjs/server";

export default async function layout({ children }: {
    children: ReactNode,
}) {
    const { userId, redirectToSignIn } = auth()
    if (!userId) {
        return redirectToSignIn()
    }
    const servers = await fetchServers()

    return (
        <div className="flex h-screen w-screen">
            <SideBar servers={servers} />
            {children}
        </div>
    )
}
