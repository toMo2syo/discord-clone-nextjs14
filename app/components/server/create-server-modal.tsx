'use client'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import SidebarTooltip from "../ui/tooltip"
import { Plus } from "lucide-react"
import FileUpload from "./file-upload"
import { MouseEvent, useState } from "react"
import { ServerformDataType } from "@/app/lib/definition"
import { createServer } from "@/app/lib/actions"
import clsx from "clsx"

export default function CreateServerModal() {
    const [loading, setLoading] = useState<Boolean>(false)
    const [open, setOpen] = useState<boolean | undefined>(false)
    const [error, setError] = useState<{
        errors?: {
            servername?: string[],
            imageUrl?: string[]
        },
        message?: string | null
    } | null>(null)
    const [server, setServer] = useState<ServerformDataType>({
        servername: '',
        imageUrl: ''
    })
    async function handleCreateServer(e: MouseEvent, server: ServerformDataType) {
        e.preventDefault()
        try {
            setLoading(true)
            const error = await createServer(server)
            if (error) {
                setError(error)
            } else {
                setOpen(false)
            }
            // window.location.reload()
            // window.location.assign('/server')
            // router.replace(`server/${res?.serverId}`)
        } catch (error) {
            console.error(error);

        } finally {
            setLoading(false)
        }
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
                <SidebarTooltip delayDuration={100} tip='Add a Server'>
                    <div className="w-[48px] h-[48px] flex items-center group dark:bg-[#313338] hover:text-[white] justify-center rounded-full transition-colors duration-50 cursor-pointer hover:rounded-2xl bg-white hover:bg-[#23a559] dark:hover:bg-[#23a559]">
                        <Plus width={24} height={24} className="text-[#23a559] group-hover:text-[white] transition-colors duration-50" />
                    </div>
                </SidebarTooltip>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-center">Customize Your Server</DialogTitle>
                    <DialogDescription className="text-center">
                        Give your new server a personality with a name and a icon.You can always change it later
                    </DialogDescription>
                </DialogHeader>
                <form>
                    <div className="space-y-8 px-2">
                        <div className="flex flex-col gap-3 items-center">
                            <div>
                                <FileUpload endpoint="serverImage" setServer={setServer} server={server} />
                            </div>
                            <div className="w-full">
                                {error?.errors?.imageUrl &&
                                    error?.errors.imageUrl.map((error: string) => (
                                        <p className="mt-2 text-sm text-red-500" key={error}>
                                            {error}
                                        </p>
                                    ))}
                            </div>
                            <div className="w-full">
                                <label htmlFor="servername" className="block mb-2 uppercase text-xs font-semibold">Server name</label>
                                <input type="text" value={server.servername} onChange={(e) => setServer({
                                    ...server,
                                    servername: e.target.value
                                })} placeholder="Enter server name" required min={3} name="servername" className="bg-[#ebebeb] w-full rounded-sm h-[40px] py-[10px] px-1 outline-none placeholder:text-sm" />
                            </div>
                            <div className="w-full">
                                {error?.errors?.servername &&
                                    error?.errors.servername.map((error: string) => (
                                        <p className="mt-2 text-sm text-red-500" key={error}>
                                            {error}
                                        </p>
                                    ))}
                            </div>
                            <div className={clsx("w-full flex justify-end", {
                                "opacity-75": loading
                            })}>
                                <div
                                    className="flex items-center justify-center w-[96px] h-[38px] py-[2px] px-[16px] rounded-sm bg-main text-white text-sm font-semibold hover:bg-main-dark"
                                    onClick={e => handleCreateServer(e, server)}
                                >
                                    <button className="outline-none">Create</button>
                                </div>
                            </div>

                        </div>
                    </div>
                </form>
            </DialogContent>
        </Dialog>

    )
}
