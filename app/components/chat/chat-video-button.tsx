'use client'

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import ActionTooltip from "../ui/action-tooltip"
import { Video, VideoOff } from "lucide-react"

export default function ChatVideoButton() {
    const pathname = usePathname()
    const router = useRouter()
    const searchParams = useSearchParams()
    const isVideo = searchParams.get('video') === 'on'
    const label = isVideo ? 'End Video Call' : 'Start Video'
    const Icon = isVideo ? <VideoOff /> : <Video />

    function handleClick() {
        const params = new URLSearchParams(searchParams)
        if (isVideo) {
            params.set('video', 'off')
        } else {
            params.set('video', 'on')
        }
        router.replace(`${pathname}?${params.toString()}`)
    }
    return (
        <div className="ml-auto mr-4 mt-2">
            <ActionTooltip delayDuration={100} side="left" label={label}>
                <button onClick={handleClick}>
                    {Icon}
                </button>
            </ActionTooltip>
        </div>
    )
}
