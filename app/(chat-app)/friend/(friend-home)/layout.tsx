import Headernav from "@/app/components/friend/headernav";
import Notification from "@/app/components/friend/notification";
import { ReactNode } from "react";

export default function layout({ children }: { children: ReactNode }) {
    return (
        <div className="flex w-full">
            <div className="flex-1 flex flex-col w-full">
                <Headernav />
                <div className='w-full h-[calc(100%-48px)] flex'>
                    <div className='flex-1 lg:flex-[2_2_0%] h-full'>
                        {children}
                    </div>
                    <div className='hidden lg:block lg:flex-1 h-full'>
                        <Notification />
                    </div>
                </div>
            </div>
        </div>
    )
}
