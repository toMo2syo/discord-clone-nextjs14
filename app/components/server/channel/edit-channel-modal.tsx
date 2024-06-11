'use client'
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import clsx from "clsx";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Channel, ChannelType } from "@prisma/client";
import { CreateChannelState, updateChannel } from "@/app/lib/actions";
import { useFormState, useFormStatus } from "react-dom";
import { Dispatch, SetStateAction } from "react";
import { ChannelModalType } from "./channel";

export default function EditChannelModal({
    modal,
    setModal,
    channel,
}: {
    modal: ChannelModalType,
    setModal: Dispatch<SetStateAction<ChannelModalType>>,
    channel: Channel,
}) {

    const initialState: CreateChannelState = { errors: {}, message: null }
    const updateChannelWithId = updateChannel.bind(null, channel.serverId, channel.channelId)
    const [error, dispatch] = useFormState(updateChannelWithId, initialState)
    return (
        <Dialog open={modal === 'EDIT_CHANNEL'} onOpenChange={open => setModal(open ? 'EDIT_CHANNEL' : '')}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-center">Edit Channel</DialogTitle>
                </DialogHeader>
                <form action={dispatch}>
                    <div className="px-2">
                        <div className="flex flex-col gap-3 items-center">
                            <div className="w-full">
                                <label htmlFor="type" className="mb-2 uppercase text-xs font-semibold">Channel Type</label>
                                <RadioGroup name="type" defaultValue={channel.channelType} className="flex gap-8 mt-2">
                                    {Object.values(ChannelType).map(type => (
                                        <div key={type} className="flex items-center space-x-2">
                                            <RadioGroupItem value={type} id={type} disabled={type !== channel.channelType} className="text-main dark:text-white" />
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
                                <input type="text" placeholder="Enter channel name" defaultValue={channel.channelName} min={3} name="channelName" className="bg-[#ebebeb] dark:bg-[#1e1f22] w-full rounded-sm h-[40px] py-[10px] px-2 outline-none placeholder:text-sm" />
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
                                <Submit />
                            </div>
                        </div>
                    </div>
                </form>
                <DialogClose className="outline-none" />
            </DialogContent>
        </Dialog>
    )
}
function Submit() {
    const { pending } = useFormStatus();
    return (
        <div>
            <button
                className={
                    clsx("flex items-center justify-center w-[96px] h-[38px] py-[2px] px-[16px] outline-none rounded-sm bg-main text-white text-sm font-semibold hover:bg-main-dark", {
                        "opacity-50": pending
                    })
                }
                type="submit"
                disabled={pending}
            >Save</button>
        </div>
    )
}
