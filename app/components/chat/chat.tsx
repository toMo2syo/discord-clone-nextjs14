import { ReactNode } from "react"

export default function Chat({
    children
}: {
    children: ReactNode
}) {
    return (
        <div className="flex w-full h-full bg-white dark:bg-[#313338]">
            <div className="flex-1">
                {children}
            </div>
        </div>
    )
}
