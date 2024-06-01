import { X } from "lucide-react";

export default function Chat() {
    return (
        <div className="px-[8px] h-[42px]">
            <div className="cursor-pointer group rounded-sm h-full px-[8px] flex items-center justify-between hover:bg-[#d7d9dc]  dark:hover:bg-[#404249]">
                <div onClick={() => console.log('parent clicked')} className="w-[80%]">
                    friend chat
                </div>
                <div className="w-[32px] h-[32px] flex items-center justify-center" onClick={() => console.log('child clicked')}>
                    <X className="text-text-light  w-[16px] h-[16px] hidden group-hover:block" />
                </div>
            </div>

        </div>
    )
}
