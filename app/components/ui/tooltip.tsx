import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Arrow } from "@radix-ui/react-tooltip"
import { ReactNode } from "react"
export default function SidebarTooltip({ children, tip, ...props }: {
    children: ReactNode,
    tip: ReactNode | string,
    [key: string]: any
}) {
    return (
        <TooltipProvider {...props}>
            <Tooltip>
                <TooltipTrigger asChild>{children}</TooltipTrigger>
                <TooltipContent side="right" className="border-none text-[#313338] dark:text-[#dbdee1] dark:bg-[#111214] font-semibold" >
                    <Arrow width={11} height={5} className="dark:fill-[#111214] fill-white" />
                    {tip}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
