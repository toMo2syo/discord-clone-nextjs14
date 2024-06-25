'use client'
import { Channel, ChannelType, Profile } from "@prisma/client"
import { Hash, Mic } from "lucide-react";
import Avatar from "../server/avatar";
import SocketIndicator from "./socket-indicator";
import ChatVideoButton from "./chat-video-button";
import { clsx } from "clsx";
type ChatHeaderProps = {
    type: 'CHANNEL' | 'CONVERSATION'
    channel?: Channel,
    member?: Profile
}
export default function ChatHeader({ type, channel, member }: ChatHeaderProps) {
    return (
        <header className="w-full flex items-center border-b-[2px] h-[48px]  pl-2 pr-4">
            <div className="flex items-center gap-2 h-[34px] rounded-sm">
                {type === 'CHANNEL' ? (
                    <>
                        {channel?.channelType === ChannelType.TEXT && <Hash width={24} height={24} color="#6d6f78" />}
                        {channel?.channelType === ChannelType.VOICE && <Mic width={24} height={24} color="#6d6f78" />}
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
            {type === 'CONVERSATION' && <ChatVideoButton />}
            <div className={clsx("", {
                "ml-auto": type !== 'CONVERSATION'
            })}>
                <SocketIndicator />
            </div>
        </header>
    )
}