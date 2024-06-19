'use client'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import clsx from "clsx";
import { Dispatch, SetStateAction } from "react";

export default function DeleteMessageModal({
    open,
    setOpen,
    handleDeleteMessage,
    isDeleting
}: {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>,
    handleDeleteMessage: (e: React.MouseEvent<HTMLButtonElement>) => void,
    isDeleting: boolean
}) {
    return (
        <Dialog open={open} onOpenChange={open => open ? true : setOpen(false)}>
            <DialogContent className="gap-0 px-0 pb-0 dark:bg-[#2b2d31]">
                <DialogHeader>
                    <DialogTitle className="text-center">Delete Message</DialogTitle>
                </DialogHeader>
                <DialogDescription className="text-center py-4">
                    <p>Are you sure you want to delete?</p>
                    <p>The message will be permanently deleted</p>
                </DialogDescription>
                <DialogFooter className="bg-[#f2f3f5] w-full p-2 dark:bg-[#2b2d31]">
                    <form>
                        <div className="px-2">
                            <div className="flex gap-3">
                                <div>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault()
                                            setOpen(false)
                                        }}
                                        className="w-[96px] outline-none border-none h-[38px] py-[2px] px-[16px] rounded-sm text-[#9599a1] text-sm font-semibold ">
                                        Cancel
                                    </button>
                                </div>
                                <div>
                                    <button
                                        onClick={e => handleDeleteMessage(e)}
                                        className={
                                            clsx("flex items-center justify-center w-[96px] h-[38px] py-[2px] px-[16px] outline-none rounded-sm bg-rose-500 text-white text-sm font-semibold hover:bg-rose-500/80", {
                                                "opacity-50": isDeleting
                                            })
                                        }
                                        disabled={isDeleting}
                                    >Delete</button>
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
