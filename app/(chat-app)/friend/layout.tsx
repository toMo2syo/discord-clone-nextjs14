import React, { ReactNode } from 'react'
import Headernav from '../../components/friend/headernav'
import FriendAsidePanel from '@/app/components/friend/friend-aside-panel'

export default function layout({ children }:
    { children: ReactNode }
) {
    return (
        <div className="flex h-screen w-full">
            <FriendAsidePanel />
            <div className="flex-1 flex flex-col w-full">
                <Headernav />
                {children}
            </div>
        </div>
    )
}
