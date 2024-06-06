import { Profile, ServerRoleType } from "@prisma/client"
import Avatar from "../Avatar"
import { UserRoundCheck, UserRoundCog } from "lucide-react"
export default function MemberProfile({ member, role }: {
    member: Profile,
    role: ServerRoleType
}) {
    return (
        <div className="flex items-center pl-[2px] gap-2 h-[34px] rounded-sm cursor-pointer hover:bg-[#d7d9dc] dark:hover:bg-[#404249] group">
            <Avatar src={member.avatarUrl} alt={member.name} size={28} />
            <span className="text-sm">{member.name}</span>
            {role === ServerRoleType.ADMIN && <UserRoundCog className="h-4 w-4 text-rose-500" />}
            {role === ServerRoleType.MODERATOR && <UserRoundCheck className="h-4 w-4 text-main" />}
        </div>
    )
}
