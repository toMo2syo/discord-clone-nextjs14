import { ReactNode } from "react";

export default function page({ children }: { children: ReactNode }) {
    return (
        <>
            {children}
        </>
    )
}
