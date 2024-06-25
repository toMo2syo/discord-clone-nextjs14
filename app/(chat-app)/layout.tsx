import { ReactNode } from "react";
import SideBar from "../components/sidebar";
import { initialProfile } from "../lib/current-profile";
import { redirect } from "next/navigation";

export default async function layout({ children }: {
    children: ReactNode,
}) {
    const profile = await initialProfile()
    if (!profile) {
        return redirect('/')
    }
    return (
        <div className="flex h-screen w-screen">
            <SideBar />
            {children}
        </div>
    )
}
