import { fetchPendingFriendRequests } from "@/app/lib/actions"
import FriendStarter from "./friend-starter"
import Avatar from "@/app/components/server/avatar"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import FriendRequestAction from "./friend-request-action"
export default async function FriendPendingList() {
    const friendRequests = await fetchPendingFriendRequests()
    if (friendRequests.length === 0) {
        return <FriendStarter type='PENDING' />
    }
    return (
        <ScrollArea className="px-4 py-2 h-[calc(100vh-48px)]">
            <ScrollBar />
            {friendRequests.map(item => (
                <div key={item.requestId} className="flex justify-between items-center border-b-2 dark:border-b-[#3f4147] pt-1 pb-2 last:border-none mb-2 last:mb-0 hover:bg-[#d7d9dc] dark:hover:bg-[#404249]">
                    <div className="flex gap-3 items-center">
                        <Avatar src={item.sender.avatarUrl} size={40} />
                        <div>
                            <p className="text-md font-bold">{item.sender.name}</p>
                            <p className="text-sm font-normal text-gray-500">Incoming Friend Request</p>
                        </div>
                    </div>
                    <FriendRequestAction requestId={item.requestId} senderId={item.senderId} />
                </div>
            ))}
        </ScrollArea>
    )
}
