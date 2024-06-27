'use client'
import { GroupMessage, Profile, ServerMembership, ServerRoleType } from "@prisma/client"
import Avatar from "@/app/components/server/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Arrow } from "@radix-ui/react-tooltip"
import { Edit, Trash2, UserRoundCheck, UserRoundCog } from "lucide-react"
import { formatDateTime } from "@/app/lib/formatDateTime"
import Image from "next/image"
import pdfIcon from '@/public/pdfIcon.svg'
import { useEffect, useState } from "react"
import { clsx } from "clsx"
import ActionTooltip from "../ui/action-tooltip"
import { useSocket } from "@/app/provider/socket-provider"
import DeleteMessageModal from "./delete-message-modal"
import { useParams, useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
const roleIconMap = {
    'ADMIN': <UserRoundCog className="h-4 w-4 text-rose-500" />,
    'MODERATOR': <UserRoundCheck className="h-4 w-4 text-main" />,
    'GUEST': null,
}

export default function ChatItem({
    currentMember,
    message
}: {
    currentMember: { profile: Profile, role: ServerRoleType }
    message: GroupMessage & { member: ServerMembership & { profile: Profile } }
}) {
    const fileType = message.fileUrl?.split('.').pop()
    const isAdmin = currentMember.role === ServerRoleType.ADMIN
    const isModerator = currentMember.role === ServerRoleType.MODERATOR
    const isOwnerOfMessage = message.member.profile.profileId === currentMember.profile.profileId
    const canDeleteMessage = !message.isDeleted && (isAdmin || isModerator || isOwnerOfMessage)
    const canEditMessage = !message.isDeleted && isOwnerOfMessage && !message.fileUrl
    const isPDF = (fileType === 'pdf' && message.fileUrl !== null)
    const isImage = (!isPDF && message.fileUrl !== null)
    const isUpdated = JSON.stringify(message.createdAt) !== JSON.stringify(message.updatedAt)
    const isMe = message.member.profileId === currentMember.profile.profileId

    const [isEditing, setIsEditting] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [content, setContent] = useState(message.content)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [open, setOpen] = useState(false)

    const { isConnected, socket } = useSocket()
    const router = useRouter()
    const params = useParams()

    function handleClickMember() {
        if (isMe) {
            return
        }
        router.push(`/server/${params?.serverId}/conversation/${message.member.profileId}`)
    }

    async function handleEditMessage(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault()
        try {
            if (content.trim().length > 0 && isConnected) {
                socket?.emit('update group message', {
                    content,
                    serverId: message.member.serverId,
                    channelId: message.channelId,
                    messageId: message.messageId,
                    method: 'PATCH'
                }, (response: any) => {
                    if (response.status === 'success') {
                        setIsEditting(false)
                    } else {
                        setError(response.message)
                    }
                })
                setLoading(false)
            }
        } catch (error) {
            setLoading(false)
            setError('Failed to Edit Message')
        }
    }

    async function handleDeleteMessage(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault()
        try {
            setIsDeleting(true)
            if (isConnected) {
                socket?.emit('update group message', {
                    content,
                    serverId: message.member.serverId,
                    channelId: message.channelId,
                    messageId: message.messageId,
                    method: 'DELETE'
                }, (response: any) => {
                    if (response.status === 'success') {
                        setIsDeleting(false)

                        setOpen(false)
                    } else {
                        setError(response.message)
                    }
                })
                setIsDeleting(false)
            }
        } catch (error) {
            setIsDeleting(false)
            setError('Failed to Delete Message')
        }
    }

    useEffect(() => {
        function handleKeyDown(event: any) {
            if (event.key === 'Escape') {
                setIsEditting(false)
            }
        }

        window.addEventListener('keydown', handleKeyDown)

        return () => window.removeEventListener('keydown', handleKeyDown)
    })

    return (
        <div className="relative group flex items-center hover:bg-[#f7f7f7] dark:hover:bg-[#404249] p-2 rounded-md transition w-full">
            <div className="group flex gap-x-2 items-center w-full">
                <div className="flex flex-col w-full">
                    <div className="flex items-center gap-x-2">
                        <div className="flex gap-1 items-center">
                            <div onClick={() => handleClickMember()} className="cursor-pointer hover:drop-shadow-md transition">
                                <Avatar src={message.member.profile.avatarUrl} size={32} />
                            </div>
                            <p onClick={() => handleClickMember()} className="font-semibold text-sm hover:underline cursor-pointer">
                                {message.member.profile.name}
                            </p>
                            <div className="cursor-pointer">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <span>{roleIconMap[message.member.serverRole]}</span>
                                        </TooltipTrigger>
                                        <TooltipContent side="top" className="text-[#313338] dark:text-[#dbdee1] dark:bg-[#111214]">
                                            <Arrow width={11} height={5} className="dark:fill-[#111214] -mt-[2px] border-none fill-white" />
                                            <span className="text-sm font-semibold">{message.member.serverRole}</span>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                            <span className="text-xs mt-1">
                                {formatDateTime(message.createdAt)}
                            </span>
                            {isMe && <Badge className="bg-main hover:bg-main-dark text-[10px] py-0 px-2">me</Badge>}
                        </div>
                    </div>
                    <div className="ml-9">
                        {isImage && (
                            <a
                                href={message.fileUrl === null ? undefined : message.fileUrl}
                                target="_blank"
                                rel="noopener onreferer"
                                className="relative aspect-square rounded-md mt-2 w-48 h-48"
                            >
                                <Image
                                    src={message.fileUrl!}
                                    alt={message.content}
                                    className="object-cover rounded-sm"
                                    width={192}
                                    height={192}
                                />
                            </a>
                        )}
                        {isPDF && (
                            <div className="my-4 flex gap-2 p-2 items-center">
                                <Image
                                    src={pdfIcon}
                                    alt={message.content}
                                    width={24}
                                    height={24}
                                />
                                <a href={message.fileUrl!} target="_blank" rel="noopener noreferer" className="underline">
                                    {message.content}
                                </a>
                            </div>
                        )
                        }
                        {!message.fileUrl && !isEditing && (
                            <p
                                className={clsx("select-text", {
                                    "italic text-sm": message.isDeleted
                                })}
                            >
                                {message.content}
                                {isUpdated && !message.isDeleted && (
                                    <span className="text-xs mx-2 text-zinc-500 dark:-zinc-600">
                                        (edited at {formatDateTime(message.updatedAt)})
                                    </span>
                                )}
                            </p>
                        )}
                        {!message.fileUrl && isEditing && (
                            <>
                                <form className="flex items-center w-full gap-x-2 pt-2">
                                    <input
                                        type="text"
                                        id="content"
                                        name="content"
                                        autoComplete="off"
                                        minLength={1}
                                        disabled={loading}
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        className={clsx("bg-[#ebedef] dark:bg-[#383a40] w-full px-1 py-1 outline-none focus:bg-none", {
                                            "opacity-50": loading
                                        })}
                                    />
                                    <button
                                        type="submit"
                                        onClick={(e) => handleEditMessage(e)}
                                        className="h-[30px] px-2 border-none rounded-sm bg-main hover:bg-main-dark transition text-white text-sm"
                                    >Save</button>
                                </form>
                                <p className="text-xs mt-1">Press <kbd className="text-main">ESCAPE</kbd> to cancel,<kbd className="text-main">ENTER</kbd> to save</p>
                                <p className="text-xs mt-1 text-rose-500">{error}</p>
                            </>
                        )}
                    </div>
                </div>
                <div className="hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-1 right-5">
                    {canEditMessage && (
                        <ActionTooltip side="top" label="Edit">
                            <Edit
                                onClick={() => setIsEditting(true)}
                                className="cursor-pointer ml-auto w-4 h-4 transition"
                            />
                        </ActionTooltip>
                    )}
                    {canDeleteMessage && (
                        <ActionTooltip side="top" label="Delete">
                            <Trash2
                                className="cursor-pointer ml-auto w-4 h-4 transition"
                                onClick={() => setOpen(true)}
                            />
                        </ActionTooltip>
                    )}
                </div>
            </div>
            <DeleteMessageModal open={open} setOpen={setOpen} handleDeleteMessage={handleDeleteMessage} isDeleting={isDeleting} />
        </div>
    )
}