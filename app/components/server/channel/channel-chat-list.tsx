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
import { useState } from "react";
import { ModalType } from "../server-menu";
import CreateChannelModal from "./create-channel-modal";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ChannelListWrapper({ channels }: { channels: Channel[] | undefined }) {
    const [modal, setModal] = useState<ModalType>('')
    return (
        <ScrollArea className="h-[calc(100vh-48px)]">
            <div className="pr-[10px]">
                <Accordion type="multiple" defaultValue={['TEXT']}>
                    {Object.values(ChannelType)
                        .filter(value => typeof value === 'string') // Filter out numeric values
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
                                            <div onClick={() => setModal('CREATE')} >
                                                <Plus width={18} height={18} strokeWidth={2} color="#5C5E66" className=" z-20" />
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent side="top" className="border-none shadow-xl rounded-sm bg-white z-10">
                                            <Arrow width={11} height={5} style={{ fill: '#fff' }} className="-mt-[1px]" />
                                            <p className="py-1 px-2 text-text-bold text-sm">Create Channel</p>
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
            {modal === 'CREATE' && <CreateChannelModal isOpen={modal === 'CREATE'} onClose={setModal} />}
        </ScrollArea>
    )
}