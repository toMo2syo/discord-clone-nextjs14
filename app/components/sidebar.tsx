import Seperator from "./friend/seperator";
import { UserButton } from "@clerk/nextjs";
import { ModeToggle } from "./mode-toggle";
import ServerList from "./server/server-list";
import Logo from "./server/logo";
import AddServer from "./server/add-server";
import { Suspense } from "react";
import { ServerListSkeleton } from "./skeletons";
export default function SideBar() {
    return (
        <div className="min-w-[72px] bg-[#e3e5e8] dark:bg-[#1e1f22] h-screens pt-3 flex flex-col gap-2 items-center">
            <Logo />
            <Suspense fallback={<ServerListSkeleton />}>
                <ServerList />
            </Suspense>
            <AddServer />
            <Seperator />
            <ModeToggle />
            <div className="mt-auto mb-3">
                <UserButton afterSignOutUrl="/" appearance={{
                    elements: {
                        avatarBox: {
                            width: 48,
                            height: 48
                        }
                    }
                }} />
            </div>
        </div>
    );
}
