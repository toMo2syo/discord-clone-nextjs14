import { fetchChannels, fetchServerMembersById } from "@/app/lib/actions";
import Search from "./search";
import { Hash, Mic, UserRoundCheck, UserRoundCog } from "lucide-react";
import { ChannelType, ServerRoleType } from "@prisma/client";

const roleIconMap = {
    [ServerRoleType.ADMIN]: <UserRoundCog width={16} height={16} className="text-rose-500" />,
    [ServerRoleType.MODERATOR]: <UserRoundCheck width={16} height={16} className="text-main" />,
    [ServerRoleType.GUEST]: null,
}
const channelMap = {
    [ChannelType.TEXT]: <Hash width={20} height={20} className="group-hover:text-text-bold text-[#6d6f78] dark:text-[#7c7f89]" />,
    [ChannelType.VOICE]: <Mic width={20} height={20} className="group-hover:text-text-bold text-[#6d6f78] dark:text-[#7c7f89]" />
}
export default async function SearchWrapper({
    serverId
}: {
    serverId: string
}) {
    const [membersWithRole, channels] = await Promise.all([
        fetchServerMembersById(serverId),
        fetchChannels(serverId)
    ])
    const textChannels = channels.filter(channel => channel.channelType === ChannelType.TEXT)
    const vioceChannels = channels.filter(channel => channel.channelType === ChannelType.VOICE)

    return (
        <div className="mt-1">
            <Search
                data={[{
                    label: 'Text Channel',
                    type: 'CHANNEL',
                    data: textChannels.map(channel => ({ id: channel.channelId, name: channel.channelName, icon: channelMap[channel.channelType] }))
                },
                {
                    label: 'Vioce Channel',
                    type: 'CHANNEL',
                    data: vioceChannels.map(channel => ({ id: channel.channelId, name: channel.channelName, icon: channelMap[channel.channelType] }))
                },
                {
                    label: 'Members',
                    type: 'MEMBER',
                    data: membersWithRole.map(member => ({ id: member.profile.profileId, name: member.profile.name, icon: roleIconMap[member.role], url: member.profile.avatarUrl }))
                }
                ]}
            />
        </div>
    )
}
