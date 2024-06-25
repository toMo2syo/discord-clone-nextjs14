'use client'

import { useModal } from "@/app/provider/modal-provider"
import { useRouter } from "next/navigation"
import { MouseEvent, useState } from "react"

export default function ServerStarter() {
    const [link, setLink] = useState('')
    const { openModal } = useModal()
    const router = useRouter()

    function handleJoinServer(e: MouseEvent<HTMLButtonElement>) {
        e.preventDefault()
        if (link.trim().length > 0) {
            console.log('clicked');

            router.push(link)
        }
    }

    return (
        <div className="flex flex-col gap-2 items-center justify-center p-4 ">
            <p>Already Have an Invite?</p>
            <div>
                <form className="flex gap-3">
                    <input type="text"
                        placeholder="Enter an invite to join an existing server"
                        className="bg-[#ebebeb] dark:bg-[#1e1f22] text-sm w-[40vw] rounded-sm h-[38px] py-[5px] px-2 outline-none placeholder:text-sm"
                        onChange={(e) => setLink(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="flex items-center outline-none justify-center w-[136px] h-[38px] py-[2px] px-[8px] rounded-sm bg-main text-white text-sm font-semibold hover:bg-main-dark"
                        onClick={(e) => handleJoinServer(e)}
                    >
                        Join Server
                    </button>
                </form>
            </div>
            <span className="text-3xl font-extralight my-2">OR</span>
            <p>Create Your Own Server</p>
            <button
                className="flex items-center outline-none justify-center w-[96px] h-[38px] py-[2px] px-[16px] rounded-sm bg-main text-white text-sm font-semibold hover:bg-main-dark"
                onClick={() => openModal('CREATE_SERVER')}
            >
                Create
            </button>
        </div>
    )
}
