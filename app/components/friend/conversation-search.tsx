import { fetchFriends } from "@/app/lib/actions"
import Search from "../server/search"

export default async function ConversationSearch() {
    const friends = await fetchFriends()

    return (
        <div className="pb-[10px] border-b-2">
            <Search data={[{
                label: 'Friends',
                type: 'CONVERSATION',
                data: friends.map(friend => ({
                    id: friend.profileId,
                    name: friend.name,
                    url: friend.avatarUrl
                }))
            }]} />
        </div>
    )
}
