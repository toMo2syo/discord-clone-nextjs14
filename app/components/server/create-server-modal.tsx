'use client'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import FileUpload from "./file-upload"
import { MouseEvent, useState } from "react"
import { ServerformDataType } from "@/app/lib/definition"
import { createServer } from "@/app/lib/actions"
import clsx from "clsx"
import { useModal } from "@/app/provider/modal-provider"

export default function CreateServerModal() {
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

    const { modal, setModal, closeModal } = useModal()

    async function handleCreateServer(e: MouseEvent, server: ServerformDataType) {
        e.preventDefault()
        try {
            setLoading(true)
            const error = await createServer(server)
            if (error) {
                setError(error)
            } else {
                closeModal()
            }
        } catch (error) {
            console.error(error);

        } finally {
            setLoading(false)
            setError(null)
        }
    }
    return (
        <Dialog open={modal === 'CREATE_SERVER'} onOpenChange={open => setModal(open ? 'CREATE_SERVER' : '')}>
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
                                })} placeholder="Enter server name" required min={3} name="servername" className="bg-[#ebebeb] dark:bg-[#1e1f22] w-full rounded-sm h-[40px] py-[10px] px-2 outline-none placeholder:text-sm" />
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

                                <button className="flex items-center outline-none justify-center w-[96px] h-[38px] py-[2px] px-[16px] rounded-sm bg-main text-white text-sm font-semibold hover:bg-main-dark"
                                    onClick={e => handleCreateServer(e, server)} >Create</button>
                            </div>
                        </div>
                    </div>
                </form>
            </DialogContent>
        </Dialog>

    )
}
