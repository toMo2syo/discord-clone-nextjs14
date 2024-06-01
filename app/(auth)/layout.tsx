import { ReactNode } from "react";

export default function layout({ children }: { children: ReactNode }) {
    return (
        <main className="w-screen h-screen flex items-center justify-center bg-[url('../public/auth/login-page-image.png')] bg-no-repeat bg-cover">
            {children}
        </main>
    )
}
