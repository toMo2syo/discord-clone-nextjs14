'use client'

import { useSocket } from "@/app/provider/socket-provider"
import { Badge } from "@/components/ui/badge"

export default function SocketIndicator() {
    const { isConnected, socket } = useSocket()
    if (isConnected) {
        return <div className="ml-auto">
            <Badge className="bg-emerald-500 hover:bg-emerald-500/90 text-white">online</Badge>
            <Badge variant="destructive" onClick={() => socket?.disconnect()}>disconnect</Badge>
        </div>
    }
    return (
        <div className="ml-auto">
            <Badge variant="destructive">offline</Badge>
            <Badge className="bg-emerald-500" onClick={() => socket?.connect()}>connect</Badge>
        </div>
    )
}
