'use client';
import { useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Channel, Profile, ServerRoleType } from "@prisma/client";
import ChatWelcome from "./chat-welcome";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchGroupMessages } from "@/app/lib/actions";
import { Fragment } from "react";
import ChatItem from "./chat-item";
import { useSocket } from "@/app/provider/socket-provider";
import { useChatSocket } from "@/app/hooks/use-chat-socket";
import { ChevronUp, Loader2 } from "lucide-react";
import { useChatScroll } from "@/app/hooks/use-chat-scroll";

type ChatAreaProps = {
    currentMember: { profile: Profile, role: ServerRoleType };
    channel: Channel;
    type: "CHANNEL" | "CONVERSATION";
};

export default function GroupChatArea({
    currentMember,
    channel,
    type
}: ChatAreaProps) {
    const queryKey = `channel:${channel.channelId}`;
    const addKey = `chat:${channel.channelId}:messages`;
    const updateKey = `chat:${channel.channelId}:messages:update`;

    const { isConnected } = useSocket();
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
        queryFn: ({ pageParam = null }: { pageParam?: string | null }) => fetchGroupMessages({ channelId: channel.channelId!, limit: 10, cursor: pageParam }),
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
        <ScrollArea ref={chatRef} className="h-full p-4 pb-20 relative overflow-y-scroll" id="chat-container">
            <div className="flex flex-col items-center gap-2 text-center">
                <ChatWelcome type={type} name={channel?.channelName!} timeline={channel?.createdAt!} />
            </div>
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
                                    <ChatItem key={message.messageId} currentMember={currentMember} message={message} />
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
