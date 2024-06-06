'use client'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ServerRoleType } from "@prisma/client"
import { Arrow } from "@radix-ui/react-tooltip";
import { Settings, Users } from "lucide-react"
import { ProfileWithRole } from "../manage-member-modal";
import MemberProfile from "./member-profile";
import { useModal } from "@/app/provider/modal-provider";

export default function MemberProfileList({ role, members }: {
    role: ServerRoleType,
    members: ProfileWithRole[]
}) {
    const { openModal } = useModal()
    return (<>
        <div className="mt-2 flex flex-col gap-2 pr-[10px]">
            <div className="flex justify-between">
                <div className="flex items-center gap-1">
                    <Users width={18} height={18} className="text-[#4e5058] dark:text-[#b5bac1]" />
                    <span className="text-xs font-semibold uppercase">Members</span>
                </div>
                {role === ServerRoleType.ADMIN && (
                    <div>
                        <TooltipProvider delayDuration={100}>
                            <Tooltip>
                                <TooltipTrigger className="w-[20px] h-[20px] cursor-pointer">
                                    <div onClick={() => openModal("MANAGE_MEMBER")}>
                                        <Settings width={16} height={16} className="text-[#4e5058] dark:text-[#b5bac1] mr-1 z-20" />
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="border-none shadow-xl rounded-sm bg-white dark:bg-[#111214] z-10">
                                    <Arrow width={11} height={5} className="fill-white dark:fill-[#111214]" />
                                    <p className="text-text-bold text-sm">Manage Member</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                )}
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
