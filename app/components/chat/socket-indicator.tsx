'use client'

import { useSocket } from "@/app/provider/socket-provider"
import { Badge } from "@/components/ui/badge"

export default function SocketIndicator() {
    const { isConnected, socket } = useSocket()
    if (isConnected) {
        return <div>
            <Badge className="bg-emerald-500 hover:bg-emerald-500/90 text-white">You&apos;re online</Badge>
        </div>
    }
    return (
        <div>
            <Badge className="bg-yellow-400 hover:bg-yellow-400/90 text-white">You&apos;re offline</Badge>
        </div>
    )
}
