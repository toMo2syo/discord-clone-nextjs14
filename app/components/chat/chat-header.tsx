'use client'
import { Channel, ChannelType, Profile } from "@prisma/client"
import { Hash, Video, Volume2 } from "lucide-react";
import Avatar from "../server/Avatar";
import { useSocket } from "@/app/provider/socket-provider";

import SocketIndicator from "./socket-indicator";
type ChatHeaderProps = {
    type: 'CHANNEL' | 'CONVERSATION'
    channel?: Channel,
    member?: Profile
}
export default function ChatHeader({ type, channel, member }: ChatHeaderProps) {
    const { isConnected } = useSocket()

    return (
        <header className="w-full flex items-center border-b-[2px] h-[48px]  pl-2 pr-4">
            <div className="flex items-center gap-2 h-[34px] rounded-sm cursor-pointer">
                {type === 'CHANNEL' ? (
                    <>
                        {channel?.channelType === ChannelType.TEXT && <Hash width={24} height={24} color="#6d6f78" />}
                        {channel?.channelType === ChannelType.AUDIO && <Volume2 width={24} height={24} color="#6d6f78" />}
                        {channel?.channelType === ChannelType.VIDEO && <Video width={24} height={24} color="#6d6f78" />}
                        <span className="text-text-bold text-base font-semibold">{channel?.channelName}</span>
                    </>
                ) : (
                    <>
                        <Avatar size={32} src={member?.avatarUrl} alt={member?.name} />
                        <span className="text-text-bold text-base font-semibold">{member?.name}</span>
                    </>
                )
                }
            </div>
            <SocketIndicator />
        </header>
    )
}