import { ServerRoleType } from "@prisma/client"
import { Users } from "lucide-react"
import MemberProfile from "./member-profile";
import MemberSettingGear from "../member-setting-gear";
import { fetchRoleByServerId, fetchServerMembersById } from "@/app/lib/actions";

export default async function MemberProfileList({ serverId }: { serverId: string }) {
    const [role, members] = await Promise.all([
        fetchRoleByServerId(serverId),
        fetchServerMembersById(serverId)
    ])
    return (<>
        <div className="mt-2 flex flex-col gap-2 pr-[10px]">
            <div className="flex justify-between">
                <div className="flex items-center gap-1">
                    <Users width={18} height={18} className="text-[#4e5058] dark:text-[#b5bac1]" />
                    <span className="text-xs font-semibold uppercase">Members</span>
                </div>
                {role === ServerRoleType.ADMIN && (<MemberSettingGear />)}
            </div>
            <div className="pl-4 flex flex-col gap-2">
                {members.map(member => (
                    <MemberProfile key={member.profile.profileId} role={member.role} member={member.profile} />
                ))}
            </div>
        </div>
    </>
    )
}
