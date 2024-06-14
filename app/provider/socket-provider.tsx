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
    console.log(isConnected);
    console.log(socket);

    useEffect(() => {
        const socketInstance = io('http://localhost:3000')

        // socketRef.current = socketInstance;
        setSocket(socketInstance) // set socket here will cause a inifite re-render,how to fix it
        console.log(socketInstance);

        socketInstance.on('connect', () => {
            console.log('Connected to socket');
            setIsConnected(true)
        })

        socketInstance.on('disconnect', () => {
            console.log('Disconnected from socket');
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