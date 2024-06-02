'use client'
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Dispatch, SetStateAction } from "react";
import { usePathname } from "next/navigation";
import { ModalType } from "../server-menu";
import clsx from "clsx";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ChannelType } from "@prisma/client";
import { CreateChannelState, createChannel } from "@/app/lib/actions";
import { useFormState, useFormStatus } from "react-dom";

export default function CreateChannelModal({
    isOpen,
    onClose
}: {
    isOpen: boolean,
    onClose: Dispatch<SetStateAction<ModalType>>
}) {
    const pathname = usePathname()
    const serverId = pathname.split('/')[2]
    const initialState: CreateChannelState = { errors: {}, message: null }
    const createChannelWithId = createChannel.bind(null, serverId)
    const [error, dispatch] = useFormState(createChannelWithId, initialState)
    return (
        <Dialog open={isOpen} onOpenChange={open => onClose(open ? 'CREATE' : '')}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-center">Create Channel</DialogTitle>
                </DialogHeader>
                <form action={dispatch}>
                    <div className="px-2">
                        <div className="flex flex-col gap-3 items-center">
                            <div className="w-full">
                                <label htmlFor="type" className="mb-2 uppercase text-xs font-semibold">Channel Type</label>
                                <RadioGroup name="type" defaultValue="TEXT" className="flex gap-8 mt-2">
                                    {Object.values(ChannelType).map(type => (
                                        <div key={type} className="flex items-center space-x-2">
                                            <RadioGroupItem value={type} id={type} className="text-main dark:text-white" />
                                            <label htmlFor={type}>{type}</label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </div>
                            <div className="w-full">
                                {error?.errors?.type &&
                                    error?.errors.type.map((error: string) => (
                                        <p className="mt-2 text-sm text-red-500" key={error}>
                                            {error}
                                        </p>
                                    ))}
                            </div>
                            <div className="w-full">
                                <label htmlFor="channelName" className="block mb-2 uppercase text-xs font-semibold">Channel name</label>
                                <input type="text" placeholder="Enter channel name" min={3} name="channelName" className="bg-[#ebebeb] dark:bg-[#1e1f22] w-full rounded-sm h-[40px] py-[10px] px-2 outline-none placeholder:text-sm" />
                            </div>
                            <div className="w-full">
                                {error?.errors?.name &&
                                    error?.errors.name.map((error: string) => (
                                        <p className="mt-2 text-sm text-red-500" key={error}>
                                            {error}
                                        </p>
                                    ))}
                            </div>
                            <div className={clsx("w-full flex justify-end")}>
                                {/* <div
                                    className="flex items-center justify-center w-[96px] h-[38px] py-[2px] px-[16px] rounded-sm bg-main text-white text-sm font-semibold hover:bg-main-dark"
                                >
                                    <button className="outline-none">Create</button>
                                </div> */}
                                <Submit onClose={onClose} />
                            </div>
                        </div>
                    </div>
                </form>
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
    const { pending, data, method, action } = useFormStatus();
    return (
        <div
            className={
                clsx("flex items-center justify-center w-[96px] h-[38px] py-[2px] px-[16px] rounded-sm bg-main text-white text-sm font-semibold hover:bg-main-dark", {
                    "opacity-50": pending
                })
            }
        >
            <button className="outline-none" type="submit" disabled={pending}>Create</button>
        </div>
    )
}
