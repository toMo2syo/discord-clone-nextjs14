'use client'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import FileUpload from "./file-upload"
import { Dispatch, MouseEvent, SetStateAction, useEffect, useState } from "react"
import { ServerformDataType } from "@/app/lib/definition"
import { fetchServerById, updateServerById } from "@/app/lib/actions"
import clsx from "clsx"
import { ModalType } from "./server-menu"
import { usePathname } from "next/navigation"

export default function CreateServerModal({
    isOpen,
    onClose
}: {
    isOpen: boolean,
    onClose: Dispatch<SetStateAction<ModalType>>
}) {
    const pathname = usePathname()
    const serverId = pathname.split('/')[2]
    const [loading, setLoading] = useState<Boolean>(false)
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

    async function handleUpdateServer(e: MouseEvent, server: ServerformDataType) {
        e.preventDefault()
        try {
            setLoading(true)
            const error = await updateServerById(serverId, server)
            if (error) {
                setError(error)
            } else {
                onClose('')
            }
        } catch (error) {
            console.error(error);

        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        async function fetchServer() {
            try {
                const server = await fetchServerById(serverId)
                if (server) {
                    setServer({
                        servername: server.serverName || '',
                        imageUrl: server.imageUrl || ''
                    })
                }
            } catch (error) {
                console.error(error);
            }
        }
        if (serverId) {
            fetchServer()
        }
    }, [serverId])

    return (
        <Dialog open={isOpen} onOpenChange={open => onClose(open ? 'SETTINGS' : '')}>
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
                                })} placeholder="Enter server name" required min={3} name="servername" className="bg-[#ebebeb] w-full rounded-sm h-[40px] py-[10px] px-2 outline-none placeholder:text-sm" />
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
                                    onClick={e => handleUpdateServer(e, server)}
                                >
                                    <button className="outline-none">Save</button>
                                </div>
                            </div>

                        </div>
                    </div>
                </form>
            </DialogContent>
        </Dialog>

    )
}
