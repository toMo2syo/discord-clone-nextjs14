import { Channel, ChannelType } from "@prisma/client"
import { Hash, Video, Volume2 } from "lucide-react";
type ChatHeaderProps = {
    type: 'CHANNEL' | 'CONVERSATION'
    channel: Channel
}
export default function ChatHeader({ channel }: ChatHeaderProps) {
    return (
        <header className="w-full flex items-center border-b-[2px] h-[48px]  px-2">
            <div className="flex items-center gap-1 h-[34px] rounded-sm cursor-pointer">
                {channel?.channelType === ChannelType.TEXT && <Hash width={24} height={24} color="#6d6f78" />}
                {channel?.channelType === ChannelType.AUDIO && <Volume2 width={24} height={24} color="#6d6f78" />}
                {channel?.channelType === ChannelType.VIDEO && <Video width={24} height={24} color="#6d6f78" />}
                <span className="text-text-bold text-base font-semibold">{channel?.channelName}</span>
            </div>
        </header>
    )
}
