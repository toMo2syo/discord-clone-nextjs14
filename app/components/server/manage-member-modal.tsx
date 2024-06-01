'use client'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ModalType } from "./server-menu";
import { usePathname } from "next/navigation";
import { fetchServerMembersById } from "@/app/lib/actions";
import { Profile, ServerRoleType } from "@prisma/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import Avatar from "./Avatar";
type ProfileWithRole = {
    profile: Profile,
    role: ServerRoleType
}
export default function ManageMemberModal({
    isOpen,
    onClose
}: {
    isOpen: boolean,
    onClose: Dispatch<SetStateAction<ModalType>>
}) {
    const pathname = usePathname()
    const serverId = pathname.split('/')[2]
    const [members, setMembers] = useState<ProfileWithRole[] | null>(null)
    useEffect(() => {
        async function fetchServerMembers() {
            try {
                const members = await fetchServerMembersById(serverId)
                console.log(members);
                setMembers(members)
            } catch (error) {
                console.error('Error fetching invite link', error)
            }
        }
        if (serverId) {
            fetchServerMembers()
        }
    }, [serverId])

    return (
        <Dialog open={isOpen} onOpenChange={open => onClose(open ? 'MANAGE' : '')}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-center">Manage Members</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    {members?.length || 0} Members
                </DialogDescription>
                <ScrollArea>
                    {members?.map(member => (
                        <div
                            key={member.profile.profileId}
                            className="flex items-center gap-x-2 mb-6"
                        >
                            <Avatar src={member.profile.avatarUrl} alt={member.profile.name} />
                        </div>
                    ))}
                </ScrollArea>
                <DialogClose className="outline-none" />
            </DialogContent>
        </Dialog>
    )
}
