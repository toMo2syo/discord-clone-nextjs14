import { ReactNode } from "react"

export default function Chat({
    children
}: {
    children: ReactNode
}) {
    return (
        <div className="w-full h-screen bg-white dark:bg-[#313338]">
            {children}
        </div>
    )
}
