import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Link from "next/link";
import Avatar from "../server/avatar";
import { fetchConversationsWithFriends } from "@/app/lib/actions";

export default async function ChatList() {
    const friends = await fetchConversationsWithFriends()
    if (friends.length === 0) {
        return <div className="w-full h-[calc(100%-80px)] flex flex-col gap-1 items-center justify-center">
            <p className="text-center text-sm text-gray-500 font-light">Start conversation</p>
            <p className="text-center text-sm text-gray-500 font-light"> by click friend&apos;s profile</p>
        </div>
    }
    return (
        <ScrollArea className="h-[calc(100%-80px)] dark:text-[#949ba4]">
            <ScrollBar />
            <div className="px-[10px] mt-2">
                {friends && friends.map(item => (
                    <div key={item?.profileId} className="border-b-[1px] last:border-none mb-2 last:mb-0 border-b-[#ccced3] dark:border-b-[#35363c]">
                        <Link href={`/friend/conversation/${item?.profileId}`} className="flex justify-between items-center cursor-pointer p-1 hover:bg-[#d7d9dc] dark:hover:bg-[#404249] rounded-md px-2">
                            <div className="flex gap-3 items-center cursor-pointer">
                                <Avatar src={item?.avatarUrl} size={32} />
                                <div>
                                    <p className="text-md font-bold">{item?.name}</p>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </ScrollArea>
    );
}


