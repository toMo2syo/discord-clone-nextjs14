'use client'
import { Channel as ChannelProps, ChannelType } from "@/app/lib/definition";
import { Channel } from "@prisma/client";
import clsx from "clsx";
import { Hash, Video, Volume2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ChannelList({ channel }: { channel: Channel }) {
    const pathname = usePathname()
    return (
        <Link href={`/server/${channel.serverId}/${channel.channelId}`} className="block mb-1">
            <div className={clsx("flex items-center gap-1 h-[34px] rounded-sm cursor-pointer hover:bg-gray-hover dark:hover:bg-[#404249] group", {
                "bg-gray-hover dark:bg-[#404249]": pathname.includes(channel.channelId),
                "": !pathname.includes(channel.channelId)
            })}>
                {channel.channelType === ChannelType.TEXT && <Hash width={20} height={20} color="#6d6f78" className="group-hover:text-text-bold" />}
                {channel.channelType === ChannelType.AUDIO && <Volume2 width={20} height={20} color="#6d6f78" className="group-hover:text-text-bold" />}
                {channel.channelType === ChannelType.VIDEO && <Video width={20} height={20} color="#6d6f78" className="group-hover:text-text-bold" />}
                <span className={clsx("text-base group-hover:text-text-bold dark:group-hover:text-white group-hover:font-semibold", {
                    "text-text-bold font-medium dark:text-white": pathname.includes(channel.channelId),
                    "text-text-light font-normal": !pathname.includes(channel.channelId),
                })}>{channel.channelName}</span>
            </div>
        </Link>
    )
}
