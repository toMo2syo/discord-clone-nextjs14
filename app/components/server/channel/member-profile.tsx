"use client"
import { Profile, ServerRoleType } from "@prisma/client"
import Avatar from "../Avatar"
import { UserRoundCheck, UserRoundCog } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { fetchCurrentProfile } from "@/app/lib/actions"
import { Badge } from "@/components/ui/badge"
export default function MemberProfile({ member, role }: {
    member: Profile,
    role: ServerRoleType
}) {
    const [profile, setProfile] = useState<Profile | null>(null)
    const pathname = usePathname()

    useEffect(() => {
        async function getProfile() {
            const profile = await fetchCurrentProfile()
            setProfile(profile)
        }
        getProfile()
    }, [])
    console.log(profile);
    console.log(profile?.profileId === member.profileId);

    return (
        <button disabled={profile?.profileId === member.profileId}>
            <Link href={`${pathname.split('/').slice(0, 3).join('/')}/conversation/${member.profileId}`} className="flex items-center pl-[2px] gap-2 h-[34px] rounded-sm cursor-pointer hover:bg-[#d7d9dc] dark:hover:bg-[#404249] group">
                <Avatar src={member.avatarUrl} alt={member.name} size={28} />
                <span className="text-sm">{member.name}</span>
                {role === ServerRoleType.ADMIN && <UserRoundCog className="h-4 w-4 text-rose-500" />}
                {role === ServerRoleType.MODERATOR && <UserRoundCheck className="h-4 w-4 text-main" />}
                {profile?.profileId === member.profileId && <Badge className="ml-auto text-xs bg-main hover:bg-mian/80">me</Badge>}
            </Link>
        </button>
    )
}
