'use client'

import { Trash2, X } from "lucide-react"
import ActionTooltip from "../ui/action-tooltip"
import { useModal } from "@/app/provider/modal-provider"

export default function FriendAction({
    friendId
}: {
    friendId: string
}) {
    const { openModal } = useModal()
    return (
        <div>
            <ActionTooltip label="Delete" delayDuration={100}>
                <button type='button' onClick={() => openModal('DELETE_FRIEND', { friendId })} className="outline-none cursor-pointer w-10 h-10 rounded-full flex items-center justify-center bg-[#f2f3f5] dark:bg-[#202124]">
                    <Trash2 width={20} height={20} className="text-rose-500 dark:text-rose-400" />
                </button>
            </ActionTooltip>
        </div>
    )
}
