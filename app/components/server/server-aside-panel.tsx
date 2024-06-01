import { ReactNode } from "react";


export default function ServerAsidePanel({ children }: { children: ReactNode }) {
    return (
        <div className="w-[232px] bg-gray-secondary h-screen bg-[#f2f3f5] dark:bg-[#2b2d31]">
            {children}
        </div>
    )
}
