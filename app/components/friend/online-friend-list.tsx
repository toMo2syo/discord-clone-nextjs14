import { fetchOnlineFriends } from "@/app/lib/actions"
import FriendStarter from "./friend-starter"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import Avatar from "@/app/components/server/avatar"
import { formatDateTime } from "@/app/lib/formatDateTime"
import Link from "next/link"

export default async function OnlineFriendList() {
    const friends = await fetchOnlineFriends()
    if (friends.length === 0) {
        return <FriendStarter type='ONLINE' />
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
                                <div className="flex items-center gap-1">
                                    <span className="w-2 h-2 bg-emerald-500 border-[1px] blur-[1px] border-white rounded-full"></span>
                                    <span className="text-xs text-emerald-500">online</span>
                                </div>
                            </div>
                        </Link >
                        <div className="mt-auto">
                            <p className="text-xs">last online time:{formatDateTime(item?.lastOnlineTime!)}</p>
                        </div>
                    </div>
                </div>
            ))}
        </ScrollArea>
    )
}
