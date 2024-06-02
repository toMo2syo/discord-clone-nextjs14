'use client'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Dispatch, SetStateAction } from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { leaveServer } from "@/app/lib/actions";
import { useFormState, useFormStatus } from "react-dom";
import { ModalType } from "./server-menu";

export default function LeaveServerModal({
    isOpen,
    onClose
}: {
    isOpen: boolean,
    onClose: Dispatch<SetStateAction<ModalType>>
}) {
    const pathname = usePathname()
    const serverId = pathname.split('/')[2]
    const leaveServerWithId = leaveServer.bind(null, serverId)
    const [error, dispatch] = useFormState(leaveServerWithId, undefined)
    return (
        <Dialog open={isOpen} onOpenChange={open => onClose(open ? 'LEAVE' : '')}>
            <DialogContent className="gap-0 px-0 pb-0 dark:bg-[#2b2d31]">
                <DialogHeader>
                    <DialogTitle className="text-center">Leave Server</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    <p className="text-center py-4">Are you sure you want to leave?</p>
                </DialogDescription>
                <DialogFooter className="bg-[#f2f3f5] w-full p-2 dark:bg-[#2b2d31]">
                    <form action={dispatch}>
                        <div className="px-2">
                            <div className="flex gap-3">
                                <div>
                                    <button
                                        onClick={() => onClose('')}
                                        className="w-[96px] h-[38px] outline-none border-none py-[2px] px-[16px] rounded-sm text-[#9599a1] text-sm font-semibold ">
                                        Cancel
                                    </button>
                                </div>
                                <div>
                                    <Submit onClose={onClose} />
                                </div>
                            </div>
                        </div>
                    </form>
                </DialogFooter>
                <DialogClose className="outline-none" />
            </DialogContent>
        </Dialog>
    )
}
function Submit({
    onClose
}: {
    onClose: Dispatch<SetStateAction<ModalType>>
}) {
    const { pending } = useFormStatus();
    return (
        <div
            className={
                clsx("flex items-center justify-center w-[96px] h-[38px] py-[2px] px-[16px] rounded-sm bg-rose-500 text-white text-sm font-semibold hover:bg-rose-500/80", {
                    "opacity-50": pending
                })
            }
        >
            <button className="outline-none" disabled={pending}>Leave</button>
        </div>
    )
}
