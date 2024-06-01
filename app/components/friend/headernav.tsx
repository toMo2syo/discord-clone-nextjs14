import Link from 'next/link'
import React from 'react'
export default function Headernav() {
    return (
        <div className='flex gap-3 items-center w-full border-b-[2px] h-[48px]  px-2"'>
            <span>Friends</span>
            <nav className='flex gap-3 items-center justify-center'>
                <Link href='/friend/online'>Online</Link>
                <Link href='/friend/all'>All</Link>
                <Link href='/friend/pending'>Pending</Link>
                <Link href='/friend/blocked'>Blocked</Link>
                <Link href='/friend/online'>Add Friend</Link>
            </nav>
        </div>
    )
}
