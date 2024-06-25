import { ReactNode } from "react"

export default function VioceWindow({ children }: { children: ReactNode }) {
    return (
        <section className="w-ful h-[calc(100vh-48px)] p-2 relative">
            {children}
        </section>
    )
}
