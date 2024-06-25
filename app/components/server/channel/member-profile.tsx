"use client"
import { Profile, ServerRoleType } from "@prisma/client"
import Avatar from "../avatar"
import { UserRoundCheck, UserRoundCog } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { fetchCurrentProfile } from "@/app/lib/actions"
import { Badge } from "@/components/ui/badge"
import clsx from "clsx"
export default function MemberProfile({ member, role }: {
    member: Profile,
    role: ServerRoleType
}) {
    const [profile, setProfile] = useState<Profile | null>(null)
    const pathname = usePathname()
    const router = useRouter()
    const isMe = profile?.profileId === member.profileId

    useEffect(() => {
        async function getProfile() {
            const profile = await fetchCurrentProfile()
            setProfile(profile)
        }
        getProfile()
    }, [])

    function handleClick() {
        if (isMe) {
            return
        }
        router.push(`${pathname.split('/').slice(0, 3).join('/')}/conversation/${member.profileId}`)
    }


    return (
        <button disabled={isMe} onClick={handleClick} className={clsx("cusor-pointer", {
            "cursor-not-allowed": isMe
        })}>
            <div className="flex items-center pl-[2px] gap-2 h-[34px] rounded-sm hover:bg-[#d7d9dc] dark:hover:bg-[#404249] group">
                <Avatar src={member.avatarUrl} alt={member.name} size={28} />
                <span className="text-sm">{member.name}</span>
                {role === ServerRoleType.ADMIN && <UserRoundCog className="h-4 w-4 text-rose-500" />}
                {role === ServerRoleType.MODERATOR && <UserRoundCheck className="h-4 w-4 text-main" />}
                {isMe && <Badge className="ml-auto text-xs bg-main hover:bg-mian/80">me</Badge>}
            </div>
        </button>
    )
}
