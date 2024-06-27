import React, { ReactNode } from 'react'
import FriendAsidePanel from '@/app/components/friend/friend-aside-panel'

export default function layout({ children }:
    { children: ReactNode }
) {
    return (
        <>
            <FriendAsidePanel />
            {children}
        </>
    )
}
