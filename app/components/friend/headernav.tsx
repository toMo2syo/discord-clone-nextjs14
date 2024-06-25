'use client'
import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
export default function Headernav() {
    const pathname = usePathname()
    return (
        <div className='flex gap-3 items-center min-w-full border-b-[2px] min-h-[48px]  px-2"'>
            <div className='flex items-center ml-1 gap-2'>
                <svg x="0" y="0" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#6d6f78" viewBox="0 0 24 24"><path fill="#6d6f78" d="M13 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"></path><path fill="#6d6f78" d="M3 5v-.75C3 3.56 3.56 3 4.25 3s1.24.56 1.33 1.25C6.12 8.65 9.46 12 13 12h1a8 8 0 0 1 8 8 2 2 0 0 1-2 2 .21.21 0 0 1-.2-.15 7.65 7.65 0 0 0-1.32-2.3c-.15-.2-.42-.06-.39.17l.25 2c.02.15-.1.28-.25.28H9a2 2 0 0 1-2-2v-2.22c0-1.57-.67-3.05-1.53-4.37A15.85 15.85 0 0 1 3 5Z" ></path></svg>
                <span className='dark:text-white font-medium'>Friends</span>
            </div>
            <div className='w-[1px] bg-gray-200 h-[20px]' />
            <nav className='flex gap-3 items-center justify-center'>
                <Link
                    href='/friend/online'
                    className={clsx('py-[2px] px-2 rounded-sm hover:bg-[#eaebed] dark:hover:bg-[#404249] dark:hover:text-gray-100', {
                        'bg-[#e1e2e4] dark:bg-[#404249] font-medium dark:text-gray-100': pathname.startsWith('/friend/online')
                    })}
                >
                    Online
                </Link>
                <Link
                    href='/friend/all'
                    className={clsx('py-[2px] px-2 rounded-sm hover:bg-[#eaebed] dark:hover:bg-[#404249] dark:hover:text-gray-100', {
                        'bg-[#e1e2e4] dark:bg-[#404249] font-medium dark:text-gray-100': pathname.startsWith('/friend/all')
                    })}
                >
                    All
                </Link>
                <Link
                    href='/friend/pending'
                    className={clsx('py-[2px] px-2 rounded-sm hover:bg-[#eaebed] dark:hover:bg-[#404249] dark:hover:text-gray-100', {
                        'bg-[#e1e2e4] dark:bg-[#404249] font-medium dark:text-gray-100': pathname.startsWith('/friend/pending')
                    })}
                >
                    Pending
                </Link>
                <Link
                    href='/friend/blocked'
                    className={clsx('py-[2px] px-2 rounded-sm hover:bg-[#eaebed] dark:hover:bg-[#404249] dark:hover:text-gray-100', {
                        'bg-[#e1e2e4] dark:bg-[#404249] font-medium dark:text-gray-100': pathname.startsWith('/friend/blocked')
                    })}
                >
                    Blocked
                </Link>
                <Link
                    href='/friend/add-friend'
                    className={clsx('py-[2px] px-2 rounded-sm hover:bg-[#eaebed] dark:hover:bg-[#404249] dark:hover:text-gray-100 whitespace-nowrap', {
                        'bg-[#e1e2e4] dark:bg-[#404249] font-medium dark:text-gray-100': pathname.startsWith('/friend/add-friend')
                    })}
                >
                    Add Friend
                </Link>
            </nav>
        </div>
    )
}
