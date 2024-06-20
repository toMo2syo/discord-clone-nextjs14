import { ReactNode } from "react"

export default function ChatWindow({ children }: { children: ReactNode }) {
    return (
        <section className="w-ful h-[calc(100vh-48px)] pl-4 pr-1 relative">
            {children}
        </section>
    )
}
