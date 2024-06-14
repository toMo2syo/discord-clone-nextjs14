'use client'
import { Plus, Smile } from 'lucide-react'
import * as z from 'zod'
import { useEffect, useState } from 'react'
import { useSocket } from '@/app/provider/socket-provider'
import clsx from 'clsx'
import { useModal } from '@/app/provider/modal-provider'
type ChatInputProps = {
    type: 'CONVERSATION' | 'CHANNEL',
    placeholder?: string,
    params: {
        serverId: string,
        channelId?: string,
        profileId?: string
    }
}

const formSchema = z.object({
    content: z.string().min(1)
})

export default function ChatInput({ type, placeholder, params }: ChatInputProps) {
    const [content, setContent] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { isConnected, socket } = useSocket()
    const { openModal } = useModal()
    const handleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault()
            setLoading(true)
            console.log(content)
            if (content.trim().length > 0 && socket && isConnected) {
                // Emit the content to the server
                socket.emit('group message', {
                    type,
                    content,
                    serverId: params.serverId,
                    channelId: params.channelId
                }, (response: any) => {
                    console.log(response);

                    if (response.status === 'success') {
                        setContent('')
                    } else {
                        setError(response.message)
                    }
                    setLoading(false)
                })
            } else {
                setLoading(false)
                setError('Cannot send an empty message')
            }
        }
    }

    return (
        <div className="bg-[#ebedef] flex items-center gap-4 dark:bg-[#383a40] w-[77%] h-[44px] px-4 py-[11px] rounded-lg fixed bottom-4">
            <div onClick={() => openModal('ATTACH_FILE')} className='p-1 cursor-pointer'>
                <Plus width={20} height={20} className='bg-[#4e5058] text-white dark:bg-[#b5bac1] dark:text-[#383a40] rounded-full' />
            </div>
            <input
                type="text"
                id="content"
                name="content"
                autoComplete="off"
                minLength={1}
                disabled={loading}
                placeholder={placeholder}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={handleKeyDown}
                className={clsx("bg-[#ebedef] dark:bg-[#383a40] w-full h-full outline-none focus:bg-none", {
                    "opacity-50": loading
                })}
            />
            <div className='p-1 cursor-pointer'>
                <Smile width={20} height={20} className='hover:text-[#fcc145]  transition transform hover:scale-150' />
            </div>
            {error && (
                <div className="text-red-500 text-sm absolute bottom-16">
                    {error}
                </div>
            )}
        </div>
    )
}
