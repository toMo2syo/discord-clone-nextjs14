'use client'

import { CreateFriendRequestState, createFriendRequest } from "@/app/lib/actions"
import clsx from "clsx"
import { useFormState, useFormStatus } from "react-dom"

export default function AddFriendForm() {
    const initialState: CreateFriendRequestState = { errors: {}, message: '' }
    const [error, dispacth] = useFormState(createFriendRequest, initialState)
    return (
        <>
            <form action={dispacth} className=" w-full py-1 mt-2 relative">
                <input type="email" id="email" name="email" className="block w-full h-[44px] py-1 px-2 bg-[#e3e5e8] dark:bg-[#1e1f22] border rounded-md text-sm shadow-sm placeholder-slate-400 dark:placeholder:text-[#87898c]
focus:outline-none focus:border-main focus:border-[1px]
disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
invalid:border-pink-500 invalid:text-pink-600
focus:invalid:border-pink-500 focus:invalid:ring-pink-500" placeholder="You can add friends with their email" />
                <Submit />
            </form>
            {error?.errors?.email &&
                error?.errors.email.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                        {error}
                    </p>
                ))}
            {!error?.success &&
                <p className="mt-2 text-sm text-red-500">
                    {error?.message}
                </p>
            }
            {error?.success &&
                <p className="mt-2 text-sm text-emerald-500">
                    {error?.message}
                </p>
            }
        </>
    )
}

function Submit() {
    const { pending } = useFormStatus()
    return (
        <button
            type="submit"
            disabled={pending}
            className={clsx("absolute outline-none rounded-sm w-[126px] h-[32px] text-xs right-4 top-[50%] translate-y-[-50%] bg-main text-white font-medium hover:bg-main-dark", {
                "opacity-50": pending
            })}>
            Send Friend Request
        </button>
    )


}
