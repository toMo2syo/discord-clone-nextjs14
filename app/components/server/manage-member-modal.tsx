'use client'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { fetchServerMembersById, removeMemberFromServer, updateServerRole } from "@/app/lib/actions";
import { Profile, ServerRoleType } from "@prisma/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Avatar from "./Avatar";
import { Check, EllipsisVertical, Loader2, ShieldQuestion, UserRound, UserRoundCheck, UserRoundCog, UserX } from "lucide-react";
import { useModal } from "@/app/provider/modal-provider";
export type ProfileWithRole = {
    profile: Profile,
    role: ServerRoleType
}
const roleIconMap = {
    'ADMIN': <UserRoundCog className="h-4 w-4 ml-2 text-rose-500" />,
    'MODERATOR': <UserRoundCheck className="h-4 w-4 ml-2 text-main" />,
    'GUEST': null,
}
export default function ManageMemberModal() {
    const [members, setMembers] = useState<ProfileWithRole[] | null>(null)
    const [loadingId, setLoadingId] = useState("")
    const [fetchTrigger, setFetchTrigger] = useState(0)

    const { modal, setModal, data } = useModal()
    const serverId = data?.serverId

    async function onRoleChange(memberId: string, role: ServerRoleType) {
        console.log(role);
        try {
            setLoadingId(memberId)
            await updateServerRole(serverId, memberId, role)
            setFetchTrigger(prev => prev + 1)  // Update the state to trigger re-fetch
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingId("")
        }
    }

    async function onKickMember(memberId: string) {
        try {
            setLoadingId(memberId)
            await removeMemberFromServer(serverId, memberId)
            setFetchTrigger(prev => prev + 1)  // Update the state to trigger re-fetch
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingId("")
        }
    }

    useEffect(() => {
        async function fetchServerMembers() {
            try {
                const members = await fetchServerMembersById(serverId)
                setMembers(members)
            } catch (error) {
                console.error('Error fetching invite link', error)
            }
        }
        if (serverId) {
            fetchServerMembers()
        }
    }, [serverId, fetchTrigger])

    return (
        <Dialog open={modal === 'MANAGE_MEMBER'} onOpenChange={open => setModal(open ? 'MANAGE_MEMBER' : '')}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-center">Manage Members</DialogTitle>
                </DialogHeader>
                <DialogDescription className="text-center">
                    {members?.length || 0} Members
                </DialogDescription>
                <ScrollArea className="mt-8 max-h-[420px] pr-4">
                    {members?.map(member => (
                        <div
                            key={member.profile.profileId}
                            className="flex items-center gap-x-2 mb-6"
                        >
                            {member.profile.avatarUrl ? (
                                <Avatar src={member.profile.avatarUrl} size={42} alt={member.profile.name} />
                            ) : (
                                <Avatar alt={member.profile.name} size={42} name={member.profile.name} />
                            )}
                            <div className="flex flex-col gap-y-1">
                                <div className="text-xs font-semibold flex items-center">
                                    <span>{member.profile.name}</span>
                                    {roleIconMap[member.role]}
                                </div>
                            </div>
                            {member.role !== 'ADMIN' &&
                                loadingId !== member.profile.profileId && (
                                    <div className="ml-auto">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger>
                                                <EllipsisVertical className="w-4 h-4" />
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent side="left">
                                                <DropdownMenuSub>
                                                    <DropdownMenuSubTrigger className="flex items-center">
                                                        <ShieldQuestion className="w-4 h-4 mr-2" />
                                                        <span>Role</span>
                                                    </DropdownMenuSubTrigger>
                                                    <DropdownMenuPortal>
                                                        <DropdownMenuSubContent>
                                                            <DropdownMenuItem onSelect={() => onRoleChange(member.profile.profileId, "GUEST")}>
                                                                <UserRound className="w-4 h-4 mr-2" />
                                                                <span>Guest</span>
                                                                {member.role === 'GUEST' &&
                                                                    <Check className="w-4 h-4 ml-auto" />
                                                                }
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onSelect={() => onRoleChange(member.profile.profileId, "MODERATOR")}>
                                                                <UserRoundCheck className="w-4 h-4 mr-2" />
                                                                <span>Moderator</span>
                                                                {member.role === 'MODERATOR' &&
                                                                    <Check className="w-4 h-4 ml-auto" />
                                                                }
                                                            </DropdownMenuItem>
                                                        </DropdownMenuSubContent>
                                                    </DropdownMenuPortal>
                                                </DropdownMenuSub>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onSelect={() => onKickMember(member.profile.profileId)}>
                                                    <UserX className="w-4 h-4 mr-2" />
                                                    <span>Kick</span>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                )}
                            {loadingId === member.profile.profileId && (
                                <Loader2
                                    className="w-4 h-4 animate-spin ml-auto"
                                />
                            )}
                        </div>
                    ))}
                </ScrollArea>
                <DialogClose className="outline-none" />
            </DialogContent>
        </Dialog>
    )
}
