'use client'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Plus } from "lucide-react";
import ChannelList from "./channel";
import { Arrow, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip";
import { Channel, ChannelType } from "@prisma/client";
import { useModal } from "@/app/provider/modal-provider";

export default function ChannelListWrapper({
    channels,
}: {
    channels: Channel[] | undefined,
}) {
    const { openModal } = useModal()
    return (
        <>
            <div className="pr-[10px]">
                <Accordion type="multiple" defaultValue={['TEXT']}>
                    {Object.values(ChannelType)
                        .filter(value => typeof value === 'string')
                        .map(type => (
                            <AccordionItem key={type} value={type} className="relative text-text-light dark:text-[#949ba4]">
                                <AccordionTrigger className="hover:no-underline">
                                    <div className="w-full flex items-center justify-between">
                                        <span className="text-xs font-semibold  uppercase">{type} CHANNELS</span>
                                    </div>
                                </AccordionTrigger>
                                <TooltipProvider delayDuration={100}>
                                    <Tooltip>
                                        <TooltipTrigger className="w-[20px] h-[20px] absolute top-4 right-0 cursor-pointer">
                                            <div onClick={() => openModal('CREATE_CHANNEL')} >
                                                <Plus width={18} height={18} strokeWidth={2} className="text-[#4e5058] dark:text-[#b5bac1] z-20" />
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent side="top" className="border-none shadow-xl rounded-sm bg-white dark:bg-[#111214] z-10">
                                            <Arrow width={11} height={5} className="fill-white dark:fill-[#111214]" />
                                            <p className="px-2 py-1 text-text-bold text-sm dark:text-[#fafaf9]">Create Channel</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>

                                <AccordionContent>
                                    <div className="pl-4">
                                        <div>
                                            {channels?.filter(channel => {
                                                return channel.channelType === ChannelType[type]
                                            }).map(channel => (
                                                <ChannelList key={channel.channelId} channel={channel} />
                                            ))}
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                </Accordion>
            </div>
        </>
    )
}