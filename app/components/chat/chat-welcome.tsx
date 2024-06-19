import { formatDateTime } from "@/app/lib/formatDateTime"

export default function ChatWelcome({
    type,
    name,
    timeline
}: {
    type: "CHANNEL" | "CONVERSATION",
    name: string,
    timeline: Date
}) {
    return (
        <div className="w-full">
            <p className="text-[32px] md:text-3xl font-bold">
                {type === 'CHANNEL' ? `Welcome to #${name}` : ''}
            </p>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                {type === 'CHANNEL' ?
                    `this is the beginning of #${name} channel` :
                    `This is the beginning of your conversation with ${name}`
                }
            </p>
            <div className="relative flex items-center w-full mt-4">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="mx-1 bg-white px-2 text-gray-500 dark:bg-gray-800 dark:text-gray-300">
                    {formatDateTime(new Date(timeline))}
                </span>
                <div className="flex-grow border-t border-gray-300"></div>
            </div>
        </div>
    )
}
