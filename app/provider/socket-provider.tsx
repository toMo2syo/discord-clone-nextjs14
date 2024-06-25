'use client'
import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";

type SocketContextType = {
    socket: Socket | null,
    isConnected: boolean
}

const SocketContext = createContext<SocketContextType | undefined>(undefined)

export function SocketProvider({ children }: { children: ReactNode }) {
    const [socket, setSocket] = useState<Socket | null>(null)
    const [isConnected, setIsConnected] = useState<boolean>(false)

    useEffect(() => {
        const socketInstance = io(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000')
        setSocket(socketInstance)

        socketInstance.on('connect', () => {
            setIsConnected(true)
        })

        socketInstance.on('disconnect', () => {
            setIsConnected(false)
        })

        return () => {
            socketInstance.disconnect()
        }
    }, [])

    return <SocketContext.Provider value={{ socket, isConnected }}>
        {children}
    </SocketContext.Provider>
}

export function useSocket() {
    const socketContext = useContext(SocketContext)
    if (socketContext === undefined) {
        throw new Error('useSocket must be used within a SocketProvider')
    }
    return socketContext
}