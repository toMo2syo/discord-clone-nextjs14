'use client';
import { useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Profile } from "@prisma/client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchDirectMessages } from "@/app/lib/actions";
import { Fragment } from "react";
import { useSocket } from "@/app/provider/socket-provider";
import { useChatSocket } from "@/app/hooks/use-chat-socket";
import { ChevronUp, Loader2 } from "lucide-react";
import { useChatScroll } from "@/app/hooks/use-chat-scroll";
import ChatBubble from "../chat/chat-bubble";

type ChatAreaProps = {
    other: Profile,
    me: Profile,
    conversationId: string
};

export default function ConverSationChatArea({
    me,
    conversationId
}: ChatAreaProps) {
    const queryKey = `server:${conversationId}`;
    const addKey = `chat:${conversationId}:messages`
    const updateKey = `chat:${conversationId}:messages:update`;


    const { isConnected, } = useSocket();
    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        status
    } = useInfiniteQuery({
        queryKey: [queryKey],
        queryFn: ({ pageParam = null }: { pageParam?: string | null }) => fetchDirectMessages({ conversationId, limit: 10, cursor: pageParam }),
        initialPageParam: null,
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
        refetchInterval: isConnected ? undefined : 1000
    });

    const chatRef = useRef<HTMLDivElement>(null)
    const bottomRef = useRef<HTMLDivElement>(null)
    //@ts-ignore
    const count = data?.pages[0].messages.length ?? 0
    useChatSocket({ addKey, updateKey, queryKey });
    useChatScroll({
        chatRef,
        bottomRef,
        loadmore: fetchNextPage,
        shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
        count
    })

    return (
        <ScrollArea ref={chatRef} className="h-full pl-4 pr-8 pb-20 relative overflow-y-scroll">
            <div className="h-10 flex items-center justify-center">
                {hasNextPage && !isFetchingNextPage && !isFetching && <ChevronUp onClick={() => fetchNextPage()} width={24} height={24} className="cursor-pointer" />}
                {isFetchingNextPage && <Loader2 width={24} height={24} className="animate-spin stroke-[1px]" />}
            </div>
            <div className="flex flex-col-reverse">
                {status === 'pending' ? (
                    <div className="w-full flex items-center justify-center">
                        <Loader2 width={36} height={36} className="animate-spin stroke-[1px]" />
                    </div>
                ) : status === 'error' ? (
                    <p className="text-center text-base text-rose-500">Error: {error.message}</p>
                ) : (
                    <>
                        {data.pages.map((group, i) => (
                            <Fragment key={i}>
                                {group?.messages.map((message) => (
                                    <ChatBubble key={message.messageId} content={message.content} sender={message.sender} isSender={message.senderId === me.profileId} fileUrl={message.fileUrl} />
                                ))}
                            </Fragment>
                        ))}
                    </>
                )}
            </div>
            <div ref={bottomRef} />
        </ScrollArea>
    );
}
