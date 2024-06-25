export default function Notification() {
    return (
        <div className="w-full h-full p-4 border-l-[2px] border-l-gray-200 dark:border-l-[#3f4147]">
            <h2 className="font-bold text-3xl mb-4 mt-2">Active Now</h2>
            <div className="p-4">
                <p className="text-center pb-1 font-semibold">It&apos;s quiet for now...</p>
                <p className=" text-center text-xs text-gray-500">When a friend starts an activity—like playing a game or hanging out on voice—we&apos;ll show it here!</p>
            </div>
        </div>
    )
}
