'use client'

import { Check, X } from "lucide-react"
import ActionTooltip from "../ui/action-tooltip"
import { acceptFriendRquest, ignoreFriendRquest } from "@/app/lib/actions"

export default function FriendRequestAction({
    requestId,
    senderId,
}: {
    requestId: string,
    senderId: string
}) {
    const accpectFriendRequestWithId = acceptFriendRquest.bind(null, requestId, senderId)
    const IgnoreFriendRequestWithId = ignoreFriendRquest.bind(null, requestId, senderId)
    return (
        <div className="flex gap-2">
            <ActionTooltip label="Accept" delayDuration={100}>
                <form action={accpectFriendRequestWithId}>
                    <button type='submit' className="outline-none cursor-pointer w-10 h-10 rounded-full flex items-center justify-center bg-[#f2f3f5] dark:bg-[#202124]">
                        <Check width={20} height={20} className="text-[#6d6f76] dark:text-[#b9bbbe]" />
                    </button>
                </form>
            </ActionTooltip>
            <ActionTooltip label="Ignore" delayDuration={100}>
                <form action={IgnoreFriendRequestWithId}>
                    <button type='submit' className="outline-none cursor-pointer w-10 h-10 rounded-full flex items-center justify-center bg-[#f2f3f5] dark:bg-[#202124]">
                        <X width={20} height={20} className="text-[#6d6f76] dark:text-[#b9bbbe]" />
                    </button>
                </form>
            </ActionTooltip>
        </div>
    )
}
