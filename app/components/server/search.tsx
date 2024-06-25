'use client'
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import { Command as CommandIcon, Search as SearchIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import Avatar from "./avatar";

type SearchProps = {
    data: {
        label: string;
        type: "CHANNEL" | "MEMBER" | "CONVERSATION";
        data: {
            id: string;
            icon?: ReactNode;
            name: string;
            url?: string | null;
        }[] | undefined
    }[]
}
export default function Search({ data }: SearchProps) {
    const [open, setOpen] = useState(false)
    const router = useRouter()
    const params = useParams()

    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }
        document.addEventListener('keydown', handleKeyDown)
        return () => {
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [])

    function handleClick({ id, type }: { id: string, type: "CHANNEL" | "MEMBER" | "CONVERSATION" }) {
        setOpen(false)
        if (type === 'CHANNEL') {
            return router.push(`/server/${params?.serverId}/${id}`)
        }
        if (type === 'MEMBER') {
            return router.push(`/server/${params?.serverId}/conversation/${id}`)
        }
        if (type === 'CONVERSATION') {
            return router.push(`/friend/conversation/${id}`)
        }
    }
    return (
        <>
            <div className="px-1">
                <button
                    className="group p-2 rounded-md flex items-center gap-x-2 w-full bg-[#e3e5e8] dark:bg-[#1e1f22] hover:bg-[#d7d9dc] dark:hover:bg-[#404249] transition"
                    onClick={(e) => {
                        e.stopPropagation()
                        setOpen(true)
                    }}
                >
                    <SearchIcon className="w-4 h-4" />
                    <span className="font-normal text-xs">Search</span>
                    <kbd className="pointer-events-none inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-auto">
                        <CommandIcon width={12} height={12} /><span>K</span>
                    </kbd>
                </button>
            </div>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Type a command or search..." />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    {data.map(({ label, type, data }) => {
                        if (!data?.length) return null
                        if (['CHANNEL', 'MEMBER'].includes(type)) {
                            return (
                                <div key={label}>
                                    <CommandGroup heading={label}>
                                        {data?.map(item => {
                                            return (
                                                <CommandItem key={item.id} className="cursor-pointer">
                                                    <div key={item.id} className="flex gap-1 items-center" onClick={() => handleClick({ id: item.id, type })}>
                                                        {type === 'MEMBER' && <Avatar src={item.url} size={24} />}
                                                        {type === 'CHANNEL' && item?.icon}
                                                        <span>{item.name}</span>
                                                        {type === 'MEMBER' && item?.icon}
                                                    </div>
                                                </CommandItem>
                                            )
                                        })}
                                    </CommandGroup>
                                    <CommandSeparator />
                                </div>
                            )
                        }
                        if (type === 'CONVERSATION') {
                            return (
                                <div key={label}>
                                    <CommandGroup heading={label}>
                                        {data?.map(item => {
                                            return (
                                                <CommandItem key={item.id} className="cursor-pointer">
                                                    <div key={item.id} className="flex gap-1 items-center" onClick={() => handleClick({ id: item.id, type })}>
                                                        <Avatar src={item.url} size={24} />
                                                        <span>{item.name}</span>
                                                    </div>
                                                </CommandItem>
                                            )
                                        })}
                                    </CommandGroup>
                                    <CommandSeparator />
                                </div>
                            )
                        }
                    })}
                </CommandList>
            </CommandDialog>
        </>
    )
}
