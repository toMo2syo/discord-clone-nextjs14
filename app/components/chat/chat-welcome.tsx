import { Hash } from "lucide-react"

export default function ChatWelcome({
    type,
    name
}: {
    type: "CHANNEL" | "CONVERSATION",
    name: string
}) {
    return (
        <div className="absolute bottom-24">
            {type === 'CHANNEL' && (
                <div className="w-[75px] h-[75px] rounded-full flex items-center justify-center bg-zinc-500 dark:bg-zinc-700">
                    <Hash className="h-12 w-12 text-white" />
                </div>
            )}
            <p className="text-xl md:text-3xl font-bold">
                {type === 'CHANNEL' ? `Welcome to #${name}` : ''}
            </p>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                {type === 'CHANNEL' ?
                    `this is the beginning of #${name} channel` :
                    `This is the beginning of your conversation with ${name}`
                }
            </p>
        </div>
    )
}
