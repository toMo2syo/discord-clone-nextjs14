'use client'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { MouseEvent, useState } from "react"
import clsx from "clsx"
import { useModal } from "@/app/provider/modal-provider"
import { UploadDropzone } from "@/app/lib/uploadthing"
import { useSocket } from "@/app/provider/socket-provider"
import { FileText, X, } from "lucide-react"
import { UploadedFileData } from "uploadthing/types"
import Image from "next/image"

export default function AttcahFileModal() {
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState('')

    const [file, setFile] = useState<UploadedFileData | null>(null)
    const { isConnected, socket } = useSocket()
    const { modal, setModal, closeModal, data } = useModal()

    const serverId = data?.serverId
    const channelId = data?.channelId
    const type = data?.type
    const conversationId = data?.conversationId
    const senderId = data?.senderId
    const recieverId = data?.recieverId

    async function handleSendAttachment(e: MouseEvent, file: UploadedFileData | null) {
        e.preventDefault()
        try {
            setLoading(true)
            if (isConnected && socket && file !== null) {
                if (type === 'CHANNEL') {
                    socket.emit('group message', {
                        content: file.name,
                        fileUrl: file.url,
                        serverId,
                        channelId
                    }, (response: any) => {
                        console.log(response);
                        if (response.status !== 'success') {
                            setError(response.message)
                        }
                        setLoading(false)
                        closeModal()
                    })
                }
                if (type === 'CONVERSATION') {
                    socket.emit('server direct message', {
                        type,
                        content: file.name,
                        fileUrl: file.url,
                        serverId,
                        senderId,
                        recieverId,
                        conversationId,
                    }, (response: any) => {
                        console.log(response);
                        if (response.status !== 'success') {
                            setError(response.message)
                        }
                        setLoading(false)
                        closeModal()
                    })
                }
            } else {
                setLoading(false)
                setError('Please Upload a File')
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false)
        }
    }
    return (
        <Dialog open={modal === 'ATTACH_FILE'} onOpenChange={open => setModal(open ? 'ATTACH_FILE' : '')}>
            <DialogContent className="dark:bg-[#1e1f22]">
                <DialogHeader>
                    <DialogTitle className="text-center">Add an attachment</DialogTitle>
                    <DialogDescription className="text-center">
                        Only Support Image and PDF
                    </DialogDescription>
                </DialogHeader>
                <form>
                    <div className="px-2">
                        <div className="flex flex-col items-center">
                            {file && file.type === 'application/pdf' && (
                                <div className="bg-gray-100 my-4 flex gap-4 p-2 rounded-md items-center relative">
                                    <FileText className="text-rose-500" />
                                    <a href={file.url} target="_blank" rel="noopener noreferer" className="hover:underline">
                                        {file.name}
                                    </a>
                                    <div
                                        className="flex items-center cursor-pointer w-[20px] h-[20px] rounded-full justify-center absolute -top-2 -right-2 bg-rose-500"
                                        onClick={() => setFile(null)}
                                    >
                                        <X width={12} height={12} color="#fff" />
                                    </div>
                                </div>
                            )}
                            {file && file.type.startsWith('image') && (
                                <div className="my-4 flex gap-4 p-2 rounded-md items-center relative">
                                    <a href={file.url} target="_blank" rel="noopener noreferer">
                                        <Image
                                            width={220}
                                            height={220}
                                            src={file.url}
                                            alt={file.name}
                                            className="object-cover rounded-md aspect-square"
                                        />
                                    </a>
                                    <div
                                        className="flex items-center cursor-pointer w-[20px] h-[20px] rounded-full justify-center absolute -top-2 -right-2 bg-rose-500"
                                        onClick={() => setFile(null)}
                                    >
                                        <X width={12} height={12} color="#fff" />
                                    </div>
                                </div>
                            )}
                            {file === null && (
                                <div>
                                    <UploadDropzone endpoint="messageFile" className="dark:border-gray-400" onUploadBegin={() => setLoading(true)} onClientUploadComplete={(res) => {
                                        setFile(res[0])
                                        setLoading(false)
                                    }} />
                                </div>
                            )}
                            <div className="w-full">
                                <p className="mt-2 text-sm text-red-500">
                                    {error}
                                </p>
                            </div>
                            <button
                                className={clsx("outline-none ml-auto w-[96px] h-[38px] px-4 py-2 rounded-sm bg-main text-white text-sm font-semibold hover:bg-main-dark", {
                                    "opacity-70": loading
                                })}
                                onClick={e => handleSendAttachment(e, file)}
                                disabled={loading}
                            >Send</button>
                        </div>
                    </div>
                </form>
            </DialogContent>
        </Dialog>

    )
}
