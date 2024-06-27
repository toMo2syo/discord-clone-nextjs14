'use client'
import { Plus } from "lucide-react";
import ActionTooltip from "../ui/action-tooltip";
import { useModal } from "@/app/provider/modal-provider";

export default function AddServer() {
    const { openModal } = useModal()
    return (
        <div>
            <ActionTooltip side="right" delayDuration={100} label='Add a Server'>
                <div onClick={() => openModal("CREATE_SERVER")} className="w-[48px] h-[48px] flex items-center group dark:bg-[#313338] hover:text-[white] justify-center rounded-full transition-colors duration-50 cursor-pointer hover:rounded-2xl bg-white hover:bg-[#23a559] dark:hover:bg-[#23a559]">
                    <Plus width={24} height={24} className="text-[#23a559] group-hover:text-[white] transition-colors duration-50" />
                </div>
            </ActionTooltip>
        </div>
    )
}
