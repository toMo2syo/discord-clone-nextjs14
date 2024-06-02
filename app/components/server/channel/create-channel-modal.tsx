'use client'
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Dispatch, SetStateAction } from "react";
import { usePathname } from "next/navigation";
import { ModalType } from "../server-menu";
import clsx from "clsx";

export default function CreateChannelModal({
    isOpen,
    onClose
}: {
    isOpen: boolean,
    onClose: Dispatch<SetStateAction<ModalType>>
}) {
    const pathname = usePathname()
    const serverId = pathname.split('/')[2]
    return (
        <Dialog open={isOpen} onOpenChange={open => onClose(open ? 'CREATE' : '')}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-center">Create Channel</DialogTitle>
                </DialogHeader>
                <form>
                    <div className="px-2">
                        <div className="flex flex-col gap-3 items-center">
                            <div className="w-full">
                                <label htmlFor="servername" className="block mb-2 uppercase text-xs font-semibold">Server name</label>
                                <input type="text" placeholder="Enter server name" required min={3} name="servername" className="bg-[#ebebeb] dark:bg-[#1e1f22] w-full rounded-sm h-[40px] py-[10px] px-2 outline-none placeholder:text-sm" />
                            </div>
                            <div className="w-full">
                                {/* {error?.errors?.servername &&
                                    error?.errors.servername.map((error: string) => (
                                        <p className="mt-2 text-sm text-red-500" key={error}>
                                            {error}
                                        </p>
                                    ))} */}
                            </div>
                            <div className={clsx("w-full flex justify-end")}>
                                <div
                                    className="flex items-center justify-center w-[96px] h-[38px] py-[2px] px-[16px] rounded-sm bg-main text-white text-sm font-semibold hover:bg-main-dark"
                                >
                                    <button className="outline-none">Create</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
                <DialogClose className="outline-none" />
            </DialogContent>
        </Dialog>
    )
}
