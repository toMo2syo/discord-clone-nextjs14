'use client'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Channel, ChannelType } from "@prisma/client";
import { Arrow } from "@radix-ui/react-tooltip";
import clsx from "clsx";
import { Hash, LockKeyhole, PencilLine, Trash2, Video, Volume2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import EditChannelModal from "./edit-channel-modal";
import { useState } from "react";
import { useModal } from "@/app/provider/modal-provider";


export default function ChannelList({ channel }: { channel: Channel }) {
    const pathname = usePathname()
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const { openModal } = useModal()
    return (
        <>
            <div onClick={(e: React.MouseEvent) => {
                e.stopPropagation()
                console.log('clicked');
                router.push(`/server/${channel.serverId}/${channel.channelId}`)
            }} className="block mb-1">
                <div className={clsx("flex items-center gap-1 h-[34px] rounded-sm cursor-pointer hover:bg-[#d7d9dc] dark:hover:bg-[#404249] group", {
                    "bg-[#d7d9dc] dark:bg-[#404249]": pathname.includes(channel.channelId),
                    "": !pathname.includes(channel.channelId)
                })}>
                    {channel.channelType === ChannelType.TEXT && <Hash width={20} height={20} className="group-hover:text-text-bold text-[#6d6f78] dark:text-[#7c7f89]" />}
                    {channel.channelType === ChannelType.AUDIO && <Volume2 width={20} height={20} className="group-hover:text-text-bold text-[#6d6f78] dark:text-[#7c7f89]" />}
                    {channel.channelType === ChannelType.VIDEO && <Video width={20} height={20} className="group-hover:text-text-bold text-[#6d6f78] dark:text-[#7c7f89]" />}
                    <div className={clsx("text-base group-hover:text-text-bold dark:group-hover:text-white group-hover:font-semibold", {
                        "text-text-bold font-medium dark:text-white": pathname.includes(channel.channelId),
                        "text-text-light font-normal": !pathname.includes(channel.channelId),
                    })}>
                        <span className="text-sm">{channel.channelName}</span>
                    </div>
                    {channel.channelName === 'general' && <LockKeyhole width={18} height={18} strokeWidth={2} className="ml-auto mr-2 text-[#5C5E66] dark:text-[#fafaf9]" />}
                    {channel.channelName !== 'general' &&
                        <div className="invisible group-hover:visible ml-auto flex gap-2 items-center mr-2 mt-1">
                            <TooltipProvider delayDuration={100}>
                                <Tooltip>
                                    <TooltipTrigger asChild onClick={(e: React.MouseEvent) => {
                                        e.stopPropagation()
                                        setOpen(true)
                                    }}>
                                        <button>
                                            <PencilLine width={18} height={18} strokeWidth={2} className="z-20 text-[#5C5E66] dark:text-[#fafaf9]" />
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent side="top" className="border-none shadow-xl rounded-sm bg-white dark:bg-black z-10">
                                        <Arrow width={11} height={5} className="-mt-[2px] fill-white dark:fill-black" />
                                        <p className="text-text-bold text-sm">Edit</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider delayDuration={100}>
                                <Tooltip>
                                    <TooltipTrigger asChild onClick={(e: React.MouseEvent) => {
                                        e.stopPropagation()
                                        openModal('DELETE_CHANNEL')
                                    }}>
                                        <button>
                                            <Trash2 width={18} height={18} strokeWidth={2} className="text-[#5C5E66] dark:text-[#fafaf9] z-20" />
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent side="top" className="border-none shadow-xl rounded-sm bg-white dark:bg-black z-10">
                                        <Arrow width={11} height={5} className="-mt-[2px] fill-white dark:fill-black" />
                                        <p className="text-text-bold text-sm">Delete</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    }
                </div>
            </div>
            {<EditChannelModal open={open} setOpen={setOpen} channel={channel} />}
        </>
    )
}
