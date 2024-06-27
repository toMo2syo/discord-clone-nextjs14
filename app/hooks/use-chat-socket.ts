import { useSocket } from "../provider/socket-provider";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

type ChatSocketProps = {
    addKey: string;
    updateKey: string;
    queryKey: string;
};

export function useChatSocket({
    addKey,
    updateKey,
    queryKey
}: ChatSocketProps) {
    const { socket } = useSocket();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!socket) return;

        // Handle new messages
        socket.on(addKey, (message: any) => {

            queryClient.setQueryData([queryKey], (oldData: any) => {
                if (!oldData) return;

                const newPages = [...oldData.pages];
                newPages[0] = {
                    ...newPages[0],
                    messages: [message, ...newPages[0].messages],
                };

                return {
                    ...oldData,
                    pages: newPages,
                };
            });
        });

        // Handle message updates (e.g., edits or deletions)
        socket.on(updateKey, (updatedMessage: any) => {

            queryClient.setQueryData([queryKey], (oldData: any) => {
                if (!oldData) return;

                const newPages = oldData.pages.map((page: any) => {
                    const newMessages = page.messages.map((msg: any) =>
                        msg.messageId === updatedMessage.messageId ? updatedMessage : msg
                    );

                    return {
                        ...page,
                        messages: newMessages,
                    };
                });

                return {
                    ...oldData,
                    pages: newPages,
                };
            });
        });

        return () => {
            socket.off(addKey);
            socket.off(updateKey);
        };
    }, [socket, addKey, updateKey, queryClient, queryKey]);
}
