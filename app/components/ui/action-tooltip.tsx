import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Arrow } from "@radix-ui/react-tooltip"
import { ReactNode } from "react"
export default function ActionTooltip({ children, label, side, ...props }: {
    children: ReactNode,
    label: ReactNode | string,
    side?: 'top' | 'right' | 'bottom' | 'left'
    [key: string]: any
}) {
    return (
        <TooltipProvider {...props}>
            <Tooltip>
                <TooltipTrigger asChild>{children}</TooltipTrigger>
                <TooltipContent side={side || 'top'} className="border-none text-[#313338] dark:text-[#dbdee1] dark:bg-[#111214] font-semibold" >
                    <Arrow width={11} height={5} className="dark:fill-[#111214] fill-white" />
                    {label}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
