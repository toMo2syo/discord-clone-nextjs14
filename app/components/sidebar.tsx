'use client'
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SidebarTooltip from "./ui/tooltip";
import Seperator from "./friend/seperator";

import { UserButton } from "@clerk/nextjs";
import { ModeToggle } from "./mode-toggle";
import { Server } from "@prisma/client";
import Image from "next/image";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Plus } from "lucide-react";
import { useModal } from "../provider/modal-provider";
export default function SideBar({ servers }: { servers: Server[] | null }) {
    const pathname = usePathname()
    // const pathname = '/server/72a6dcb8-06fb-4683-99d5-49efbbd1e413/fdcdeccf-72f6-44b3-9908-6d46347a963a'
    const { openModal } = useModal()
    const isInFriendPage = pathname.startsWith('/friend')

    return (
        <div className="min-w-[72px] bg-[#e3e5e8] dark:bg-[#1e1f22] h-screens pt-3 flex flex-col gap-2 items-center">
            <div className="w-12 h-12 bg-gray-700 rounded-full">
                <SidebarTooltip delayDuration={100} tip="Direct Message">
                    <Link href="/friend/online" className={
                        clsx("w-[48px] h-[48px] relative flex cursor-pointer items-center transition-colors duration-75 ease-in justify-center group hover:bg-main dark:hover:bg-main  hover:rounded-2xl", {
                            "bg-white dark:bg-[#313338] rounded-full": !isInFriendPage,
                            "bg-main rounded-2xl": isInFriendPage
                        })}>
                        <svg className={clsx('fill-black dark:fill-[#dbdee1] group-hover:fill-white', {
                            'fill-white': isInFriendPage
                        })} width="30px" height="30px" viewBox="0 -28.5 256 256" version="1.1" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid">
                            <g>
                                <path d="M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201 245.831087,59.8662432 216.856339,16.5966031 Z M85.4738752,135.09489 C72.8290281,135.09489 62.4592217,123.290155 62.4592217,108.914901 C62.4592217,94.5396472 72.607595,82.7145587 85.4738752,82.7145587 C98.3405064,82.7145587 108.709962,94.5189427 108.488529,108.914901 C108.508531,123.290155 98.3405064,135.09489 85.4738752,135.09489 Z M170.525237,135.09489 C157.88039,135.09489 147.510584,123.290155 147.510584,108.914901 C147.510584,94.5396472 157.658606,82.7145587 170.525237,82.7145587 C183.391518,82.7145587 193.761324,94.5189427 193.539891,108.914901 C193.539891,123.290155 183.391518,135.09489 170.525237,135.09489 Z" fillRule="nonzero">
                                </path>
                            </g>
                        </svg>
                        {isInFriendPage && (<span className="absolute w-[8px] h-[40px] rounded-r-[4px] top-[4px] -left-[16px] bg-[#060607] dark:bg-[#f2f3f5]"></span>)}
                    </Link>
                </SidebarTooltip>
            </div>
            <Seperator />
            <ScrollArea className="w-full shadow-inner">
                <ScrollBar />
                <div>
                    {servers && (<nav className="flex -mt-2 flex-col gap-2 items-center">
                        {servers.map(server => (
                            server?.imageUrl ? (
                                <SidebarTooltip delayDuration={100} key={server.serverId} tip={server.serverName}>
                                    <div className="min-w-[48px] min-h-[48px] mt-2">
                                        <Link
                                            key={server.serverId}
                                            href={`/server/${server.serverId}`}
                                            className="w-full h-full relative"
                                        >
                                            <Image
                                                src={server.imageUrl}
                                                alt={server.serverName}
                                                width={48}
                                                height={48}
                                                className="min-w-[48px] min-h-[48px] aspect-square object-cover rounded-full"
                                            />
                                            {pathname.startsWith(`/server/${server.serverId}`) && (<span className="absolute w-[8px] h-[40px] rounded-r-[4px] top-[4px] -left-[16px] bg-[#060607] dark:bg-[#f2f3f5]"></span>)}
                                        </Link>
                                    </div>
                                </SidebarTooltip>
                            ) : (
                                <SidebarTooltip delayDuration={100} key={server.serverId} tip={server.serverName}>
                                    <Link href={`/server/${server.serverId}`}
                                        className={clsx("w-[48px] h-[48px] relative dark:bg-[#313338] hover:text-white font-semibold  hover:font-semibold hover:rounded-2xl hover:bg-main-dark dark:hover:bg-main-dark transition-colors duration-50 ease-in flex items-center justify-center", {
                                            'rounded-full bg-white': !pathname.startsWith(`/server/${server.serverId}`),
                                            'text-white rounded-2xl bg-main-dark dark:dark:bg-main': pathname.startsWith(`/server/${server.serverId}`),
                                        }
                                        )}>
                                        {server.serverName.substring(0, 2)}
                                        {pathname.startsWith(`/server/${server.serverId}`) && (<span className="absolute w-[8px] h-[40px] rounded-r-[4px] top-[4px] -left-[16px] bg-[#060607] dark:bg-[#f2f3f5]"></span>)}
                                    </Link>
                                    <Seperator />
                                </SidebarTooltip>
                            )

                        ))}
                    </nav>)}
                </div>
            </ScrollArea>
            <div>
                <SidebarTooltip delayDuration={100} tip='Add a Server'>
                    <div onClick={() => openModal("CREATE_SERVER")} className="w-[48px] h-[48px] flex items-center group dark:bg-[#313338] hover:text-[white] justify-center rounded-full transition-colors duration-50 cursor-pointer hover:rounded-2xl bg-white hover:bg-[#23a559] dark:hover:bg-[#23a559]">
                        <Plus width={24} height={24} className="text-[#23a559] group-hover:text-[white] transition-colors duration-50" />
                    </div>
                </SidebarTooltip>
            </div>
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
