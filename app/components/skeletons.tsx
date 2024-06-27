import { Skeleton } from "@/components/ui/skeleton";

export function SearchSkeleton() {
    return (
        <div className="px-1">
            <div className="group p-2 h-[36px] rounded-md flex items-center gap-x-2 w-full bg-[#e3e5e8] dark:bg-[#1e1f22]">
                <Skeleton className="w-4 h-4 rounded-full bg-muted" />
                <Skeleton className="w-12 h-4 bg-muted" />
                <div className="ml-auto">
                    <Skeleton className="w-8 h-4 bg-muted" />
                </div>
            </div>
        </div>
    )
}

export function ConversationSearchSkeleton() {
    return (
        <div className="pb-[10px] border-b-2">
            <SearchSkeleton />
        </div>
    )
}

export function ChannelConversationSearchSkeleton() {
    return (
        <div className="mt-1">
            <SearchSkeleton />
        </div>
    )
}
export function ChatListSkeleton() {
    const skeletonItems = Array.from({ length: 14 })
    return (
        <div className="h-[calc(100%-80px)]">
            <div className="px-[10px] mt-2">
                {skeletonItems.map((_, index) => (
                    <div key={index} className="border-b-[1px] last:border-none mb-2 last:mb-0 border-b-[#ccced3] dark:border-b-[#35363c]">
                        <div className="flex justify-between items-center cursor-pointer p-1 rounded-md px-2">
                            <div className="flex gap-3 items-center cursor-pointer">
                                <Skeleton className="w-8 h-8 rounded-full bg-[#e3e5e8] dark:bg-[#292524]" />
                                <div>
                                    <Skeleton className="w-24 h-4 bg-[#e3e5e8] dark:bg-[#292524]" />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export function OnlineFriendListSkeleton() {
    const skeletonItems = Array.from({ length: 11 })

    return (
        <div className="px-4 py-2 h-[calc(100vh-48px)]">
            {skeletonItems.map((_, index) => (
                <div key={index} className="border-b-[1px] last:border-none dark:border-b-[#3f4147] mb-2 last:mb-0">
                    <div className="flex justify-between items-center pt-1 pb-2 rounded-md px-2">
                        <div className="flex gap-3 items-center cursor-pointer">
                            <Skeleton className="w-10 h-10 rounded-full" />
                            <div>
                                <Skeleton className="w-24 h-4 mb-2" />
                                <div className="flex items-center gap-1">
                                    <Skeleton className="w-2 h-2 rounded-full" />
                                    <Skeleton className="w-12 h-3" />
                                </div>
                            </div>
                        </div>
                        <div className="mt-auto">
                            <Skeleton className="w-32 h-3" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export function FriendListSkeleton() {
    const skeletonItems = Array.from({ length: 11 })

    return (
        <div className="px-4 py-2 h-[calc(100vh-48px)]">
            {skeletonItems.map((_, index) => (
                <div key={index} className="border-b-[1px] last:border-none dark:border-b-[#3f4147] mb-2 last:mb-0">
                    <div className="flex justify-between items-center pt-1 pb-2 rounded-md px-2">
                        <div className="flex gap-3 items-center cursor-pointer">
                            <Skeleton className="w-10 h-10 rounded-full" />
                            <div>
                                <Skeleton className="w-24 h-4 mb-2" />
                            </div>
                        </div>
                        <div className="ml-auto">
                            <Skeleton className="w-10 h-10 rounded-full" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
export function PendingFriendListSkeleton() {
    const skeletonItems = Array.from({ length: 11 })

    return (
        <div className="px-4 py-2 h-[calc(100vh-48px)]">
            {skeletonItems.map((_, index) => (
                <div key={index} className="border-b-[1px] last:border-none dark:border-b-[#3f4147] mb-2 last:mb-0">
                    <div className="flex justify-between items-center pt-1 pb-2 rounded-md px-2">
                        <div className="flex gap-3 items-center cursor-pointer">
                            <Skeleton className="w-10 h-10 rounded-full" />
                            <div>
                                <Skeleton className="w-24 h-4 mb-2" />
                            </div>
                        </div>
                        <div className="mt-auto flex gap-2">
                            <Skeleton className="w-10 h-10 rounded-full" />
                            <Skeleton className="w-10 h-10 rounded-full" />
                        </div>
                    </div>

                </div>
            ))}
        </div>
    )
}

export function ChatHeaderSkeleton({ type }: { type: 'CONVERSATION' | 'CHANNEL' }) {
    return (
        <header className="w-full flex items-center border-b-[2px] h-[48px] pl-2 pr-4">
            <div className="flex items-center gap-2 h-[34px]">
                {type === 'CHANNEL' ? (
                    <>
                        <Skeleton className="w-6 h-6 rounded-full" />
                        <Skeleton className="w-32 h-6" />
                    </>
                ) : (
                    <>
                        <Skeleton className="w-8 h-8 rounded-full" />
                        <Skeleton className="w-32 h-6" />
                    </>
                )}
            </div>
            <div className="flex items-center gap-4 ml-auto">
                {type === 'CONVERSATION' && (<Skeleton className="w-6 h-6" />)}
                <Skeleton className="w-24 h-6 rounded-full" />
            </div>
        </header>
    )
}

export function ChatAreaSkeleton() {
    return (
        <Skeleton className="h-full w-full pl-4 pr-8 pb-20 relative">
            <ChatInputSkeleton />
        </Skeleton>
    )
}

export function ChatInputSkeleton() {
    return (
        <div className="bg-[#ebedef] fixed bottom-4 flex items-center gap-4 dark:bg-[#383a40] w-[93%] md:w-[57%] lg:w-[68%] xl:w-[78%] 2xl-[81%] h-[44px] px-4 py-[11px] rounded-lg ">
            <Skeleton className="w-6 h-6 rounded-full bg-[#6d6f7a] dark:bg-[#b5bac1]" />
            <Skeleton className="flex-1 h-full bg-[#ebedef] dark:bg-[#383a40]" />
            <Skeleton className="w-6 h-6 rounded-full bg-[#6d6f7a] dark:bg-[#b5bac1]" />
        </div>
    )
}

export function ServerListSkeleton() {
    const skeletonItems = Array.from({ length: 7 })
    return (
        <>
            <div className="w-full shadow-inner">
                <div className="flex mt-1 h-[388px] flex-col gap-2 items-center">
                    {/* Placeholder for multiple server links */}
                    {skeletonItems.map((_, index) => (
                        <Skeleton key={index} className="w-12 h-12 rounded-full" />
                    ))}
                </div>
            </div>
        </>
    )
}

export function ServerMenuSkeleton() {
    return (
        <div className="w-[232px] px-[10px] border-b-[2px] h-[48px] flex items-center justify-between">
            <Skeleton className="w-1/2 h-4 rounded bg-[#e3e5e8] dark:bg-[#1e1f22]" />
            <Skeleton className="w-4 h-4 rounded-full bg-[#e3e5e8] dark:bg-[#1e1f22]" />
        </div>
    )
}

export function ChannelTypeListSkeleton() {
    const skeletonItems = Array.from({ length: 2 })
    return (
        <div className="ml-1 pr-[10px]">
            {skeletonItems.map((_, index) => (
                <div key={index} className="h-[49px] border-b w-full flex items-center justify-between">
                    <Skeleton className="w-32 h-4 rounded-md bg-[#e3e5e8] dark:bg-[#1e1f22]" />
                    <Skeleton className="w-4 h-4 rounded-full bg-[#e3e5e8] dark:bg-[#1e1f22]" />
                </div>
            ))}
        </div>
    )
}

export function MemberProfileListSkeleton() {
    const skeletonItems = Array.from({ length: 10 })
    return (
        <div className="w-full mt-2 flex flex-col gap-2 pr-[10px]">
            <div className="flex item-center justify-between">
                <Skeleton className="w-20 h-4 ml-1 rounded bg-[#e3e5e8] dark:bg-[#292524]" />
                <Skeleton className="w-4 h-4 rounded-full bg-[#e3e5e8] dark:bg-[#1e1f22]" />
            </div>
            {skeletonItems.map((_, index) => (
                <div key={index} className="flex items-center pl-[2px] gap-2 h-[34px] rounded-sm">
                    <Skeleton className="w-7 h-7 rounded-full bg-[#e3e5e8] dark:bg-[#292524]" />
                    <Skeleton className="w-1/2 h-4 rounded bg-[#e3e5e8] dark:bg-[#292524]" />
                </div>
            ))}
        </div>
    )
}