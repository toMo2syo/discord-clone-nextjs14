'use client'

import Image from "next/image"
import online from '@/public/online.svg'
import onlineDark from '@/public/online-dark.svg'
import all from '@/public/all.svg'
import allDark from '@/public/all-dark.svg'
import pending from '@/public/pending.svg'
import pendingDark from '@/public/pending-dark.svg'
import blocked from '@/public/blocked.svg'
import blockedDark from '@/public/blocked-dark.svg'
import { useTheme } from "next-themes"
type FriendStarterProps = {
    type: 'ALL' | 'BLOCKED' | 'ONLINE' | 'PENDING'
}
export default function FriendStarter({
    type
}: FriendStarterProps) {
    const { resolvedTheme } = useTheme()
    const light = resolvedTheme === 'light'
    let image = null
    let text = ''
    switch (type) {
        case 'ALL': {
            image = light ? all : allDark
            text = "Wumpus is waiting on friends. You don't have to though!"
            break
        }
        case 'BLOCKED': {
            image = light ? blocked : blockedDark
            text = "You can't unblock the Wumpus."
            break
        }
        case 'ONLINE': {
            image = light ? online : onlineDark
            text = "No one's around to play with Wumpus."
            break
        }
        case 'PENDING': {
            image = light ? pending : pendingDark
            text = "There are no pending friend requests. Here's Wumpus for now."
            break
        }
    }

    return (
        <div className="flex flex-col w-full h-full">
            <div className="w-full flex-1 flex items-center justify-center">
                <div className="flex-col items-center justify-center">
                    <Image
                        src={image}
                        alt='Wumpus'
                        width={421}
                        height={218}
                    />
                    <p className="text-sm text-gray-500 font-light text-center mt-11">{text}</p>
                </div>
            </div>
        </div>
    )
}
