'use client'
import { useSearchParams } from "next/navigation"
import { ReactNode } from "react"
import MediaRoom from "./media-room"
import VioceWindow from "./voice-window"

export default function ChatWindow({ type, conversationId, children }: { children: ReactNode, type?: 'CONVERSATION' | 'CHANNEL', conversationId?: string }) {
    const searchParams = useSearchParams()
    if (type === 'CONVERSATION' && searchParams.get('video') === 'on') {
        return <>
            <VioceWindow>
                <MediaRoom chatId={conversationId!} video={true} audio={true} />
            </VioceWindow>
        </>
    }
    return (
        <section className="w-ful h-[calc(100%-48px)] pl-4 pr-1 relative">
            {children}
        </section>
    )
}
