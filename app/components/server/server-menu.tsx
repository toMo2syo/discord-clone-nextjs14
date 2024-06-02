'use client'
import { Profile, ServerRoleType } from "@prisma/client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { ChevronDown, LogOut, PlusCircle, Settings, Trash, UserPlus, Users } from "lucide-react";
import InvitePeopleModal from "./invite-people-modal";
import { useState } from "react";
import ServerSettingModal from "./server-setting-modal";
import ManageMemberModal from "./manage-member-modal";
import CreateChannelModal from "./channel/create-channel-modal";

export type ModalType = 'INVITE' | 'SETTING' | 'MANAGE' | 'CREATE' | ''
export default function ServerMenu({
    profile,
    role
}: {
    profile: Profile | undefined,
    role: ServerRoleType
}) {
    const isAdmin = role === ServerRoleType.ADMIN
    const isModerator = isAdmin || role === ServerRoleType.MODERATOR
    const [modal, setModal] = useState<ModalType>('')
    return (
        <div className="w-full px-[10px] hover:bg-gray-hover dark:hover:bg-[#35373c] border-b-[2px] flex justify-center">
            <DropdownMenu>
                <DropdownMenuTrigger className="outline-none">
                    <div className="w-[212px] text-text-bold h-[46px] flex justify-between items-center">
                        <span className="font-semibold  dark:text-[#f2f3f5]">{profile?.name} &apos;s server</span>
                        <ChevronDown className="w-[16px] h-[16px] stroke-[3px] dark:text-[#cccdd0]" />
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white w-[212px] dark:bg-[#111214] mt-2 py-[6px] px-2 z-10">
                    {isAdmin && (
                        <>
                            <DropdownMenuLabel className="px-2 py-[6px] my-[2px] text-[#4e5058] dark:text-[#b5bac1] font-medium text-[14px] cursor-pointer hover:bg-[#505cdc] hover:text-white dark:hover:text-white hover:rounded-[2px] transition">
                                <DropdownMenuItem onSelect={() => setModal('INVITE')} className="flex justify-between items-center outline-none">
                                    <span>Invite People</span>
                                    <UserPlus width={18} height={18} />
                                </DropdownMenuItem>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-[#e1e2e4] dark:bg-[#2e2f34] w-full h-[1px]" />
                        </>
                    )}
                    {isAdmin && (
                        <>
                            <DropdownMenuLabel className="px-2 py-[6px] my-[2px] text-[#4e5058] dark:text-[#b5bac1] font-medium text-[14px] cursor-pointer hover:bg-[#505cdc] hover:text-white dark:hover:text-white hover:rounded-[2px] transition">
                                <DropdownMenuItem onSelect={() => setModal('SETTING')} className="flex justify-between items-center outline-none">
                                    <span>Server Settings</span>
                                    <Settings width={18} height={18} />
                                </DropdownMenuItem>
                            </DropdownMenuLabel>
                        </>
                    )}
                    {isAdmin && (
                        <>
                            <DropdownMenuLabel className="px-2 py-[6px] my-[2px] text-[#4e5058] dark:text-[#b5bac1] font-medium text-[14px] cursor-pointer hover:bg-[#505cdc] hover:text-white dark:hover:text-white hover:rounded-[2px] transition">
                                <DropdownMenuItem onSelect={() => setModal('MANAGE')} className="flex justify-between items-center outline-none">
                                    <span>Manage Members</span>
                                    <Users width={18} height={18} />
                                </DropdownMenuItem>
                            </DropdownMenuLabel>
                        </>
                    )}
                    {isModerator && (
                        <>
                            <DropdownMenuLabel className="px-2 py-[6px] my-[2px] text-[#4e5058] dark:text-[#b5bac1] font-medium text-[14px] cursor-pointer hover:bg-[#505cdc] hover:text-white dark:hover:text-white hover:rounded-[2px] transition">
                                <DropdownMenuItem onSelect={() => setModal('CREATE')} className="flex justify-between items-center outline-none">
                                    <span>Create Channels</span>
                                    <PlusCircle width={18} height={18} />
                                </DropdownMenuItem>
                            </DropdownMenuLabel>
                        </>
                    )}
                    <DropdownMenuSeparator className="bg-[#e1e2e4] dark:bg-[#2e2f34] w-full h-[1px]" />
                    {isAdmin && (
                        <>
                            <DropdownMenuLabel className="px-2 py-[6px] my-[2px] text-rose-500 font-medium text-[14px] cursor-pointer hover:bg-rose-500 hover:text-white dark:hover:text-white hover:rounded-[2px] transition">
                                <DropdownMenuItem className="flex justify-between items-center outline-none">
                                    <span>Delete Server</span>
                                    <Trash width={18} height={18} />
                                </DropdownMenuItem>
                            </DropdownMenuLabel>
                        </>
                    )}
                    {!isAdmin && (
                        <>
                            <DropdownMenuLabel className="px-2 py-[6px] my-[2px] text-rose-500 font-medium text-[14px] cursor-pointer hover:bg-rose-500 hover:text-white dark:hover:text-white hover:rounded-[2px] transition">
                                <DropdownMenuItem className="flex justify-between items-center outline-none">
                                    <span>Leave Server</span>
                                    <LogOut width={18} height={18} />
                                </DropdownMenuItem>
                            </DropdownMenuLabel>
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
            {modal === 'INVITE' && <InvitePeopleModal isOpen={modal === 'INVITE'} onClose={setModal} />}
            {modal === 'SETTING' && <ServerSettingModal isOpen={modal === 'SETTING'} onClose={setModal} />}
            {modal === 'MANAGE' && <ManageMemberModal isOpen={modal === 'MANAGE'} onClose={setModal} />}
            {modal === 'CREATE' && <CreateChannelModal isOpen={modal === 'CREATE'} onClose={setModal} />}
        </div>
    )
}
