import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Avatar from "@/app/components/server/avatar";
import { fetchFriends } from "@/app/lib/actions";
import FriendStarter from "./friend-starter";
import FriendAction from "./friend-action";
import Link from "next/link";

export default async function FriendList() {
    const friends = await fetchFriends()
    if (friends.length === 0) {
        return <FriendStarter type='ALL' />
    }

    return (
        <ScrollArea className="px-4 py-2 h-[calc(100vh-48px)]">
            <ScrollBar />
            {friends && friends.map(item => (
                <div key={item?.profileId} className="border-b-[1px] last:border-none dark:border-b-[#3f4147] mb-2 last:mb-0">
                    <div className="flex justify-between items-center pt-1 pb-2 hover:bg-[#e3e5e8] dark:hover:bg-[#404249] rounded-md px-2">
                        <Link href={`/friend/conversation/${item?.profileId}`} className="flex gap-3 items-center cursor-pointer">
                            <Avatar src={item?.avatarUrl} size={40} />
                            <div>
                                <p className="text-md font-bold">{item?.name}</p>
                            </div>
                        </Link>
                        <FriendAction friendId={item.profileId} />
                    </div>
                </div>
            ))}
        </ScrollArea>
    )
}
