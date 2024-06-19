import { ReactNode } from "react"

export default function ChatWindow({ children }: { children: ReactNode }) {
    return (
        <section className="w-ful h-[calc(100vh-48px)] px-4 relative">
            {children}
        </section>
    )
}
