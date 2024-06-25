import AddFriendForm from "@/app/components/friend/add-friend-form";
import FriendStarter from "@/app/components/friend/friend-starter";
export default function Page() {
    return (
        <div className="flex flex-col w-full h-full">
            <div className="py-5 px-8 flex flex-col gap-2">
                <h6 className="uppercase font-semibold">add friend</h6>
                <p className="text-sm text-gray-400">You can add friends with their email</p>
                <AddFriendForm />
            </div>
            <FriendStarter type='ALL' />
        </div>
    )
}