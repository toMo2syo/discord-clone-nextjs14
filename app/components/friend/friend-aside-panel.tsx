'use client'
import { Arrow, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip";
import { Plus } from "lucide-react";
import ConversationSearch from "./conversation-search";
import ChatList from "./chat-list";

export default function FriendAsidePanel() {
    return (
        <div className="min-w-[232px] bg-[#f2f3f5] dark:bg-[#2b2d31] text-black h-screen">
            <ConversationSearch />
            <div className="flex justify-between items-center px-[10px] text-text-light dark:text-[#949ba4]">
                <p className="mt-[10px] uppercase text-xs font-semibold">direct msessages</p>
                <TooltipProvider delayDuration={100}>
                    <Tooltip>
                        <TooltipTrigger>
                            <Plus className="cursor-pointer pt-[10px]" />
                        </TooltipTrigger>
                        <TooltipContent side="top" className="border-none shadow-xl rounded-sm bg-white z-10">
                            <Arrow width={11} height={5} className="fill-white dark:fill-[#000] -mt-[1px]" />
                            <p className="py-1 px-2 text-text-bold dark:text-[#dbdee1] text-sm dark:bg-black">Create DM</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
            <ChatList />
        </div>
    )
}
