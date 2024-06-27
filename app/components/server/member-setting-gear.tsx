'use client'
import { useModal } from "@/app/provider/modal-provider";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Arrow } from "@radix-ui/react-tooltip";
import { Settings } from "lucide-react";

export default function MemberSettingGear() {
    const { openModal } = useModal()
    return (
        <div>
            <TooltipProvider delayDuration={100}>
                <Tooltip>
                    <TooltipTrigger className="w-[20px] h-[20px] cursor-pointer">
                        <div onClick={() => openModal("MANAGE_MEMBER")}>
                            <Settings width={16} height={16} className="text-[#4e5058] dark:text-[#b5bac1] mr-1 z-20" />
                        </div>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="border-none shadow-xl rounded-sm bg-white dark:bg-[#111214] z-10">
                        <Arrow width={11} height={5} className="fill-white dark:fill-[#111214]" />
                        <p className="text-text-bold text-sm">Manage Member</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    )
}
