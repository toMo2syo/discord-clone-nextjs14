'use client'
import { Plus } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useSocket } from '@/app/provider/socket-provider'
import clsx from 'clsx'
import { useModal } from '@/app/provider/modal-provider'
import EmojiPicker from './emoji-picker'
type ChatInputProps = {
    type: 'CONVERSATION' | 'CHANNEL',
    placeholder?: string,
    params: {
        serverId?: string,
        channelId?: string,
        profileId?: string,
        conversationId?: string,
        senderId?: string,
        recieverId?: string,
    }
}

export default function ChatInput({ type, placeholder, params }: ChatInputProps) {
    const [content, setContent] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { isConnected, socket } = useSocket()
    const { openModal } = useModal()
    const chatInptRef = useRef<HTMLInputElement>(null)
    const handleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault()
            setLoading(true)
            if (content.trim().length > 0 && socket && isConnected) {
                // Emit the content to the server
                if (type === 'CHANNEL') {
                    socket.emit('group message', {
                        type,
                        content,
                        serverId: params.serverId,
                        channelId: params.channelId
                    }, (response: any) => {
                        console.log(response);

                        if (response.status === 'success') {
                            console.log(response);
                            setContent('')
                            handleFocus()
                        } else {
                            setError(response.message)
                        }
                        setLoading(false)
                    })
                }

                if (type === 'CONVERSATION') {
                    console.log('conversation chat');
                    console.log(content);

                    socket.emit('server direct message', {
                        type,
                        content,
                        conversationId: params.conversationId,
                        serverId: params.serverId,
                        senderId: params.senderId,
                        recieverId: params.recieverId
                    }, (response: any) => {
                        console.log(response);

                        if (response.status === 'success') {
                            console.log(response);
                            setContent('')
                            handleFocus()
                        } else {
                            setError(response.message)
                        }
                        setLoading(false)
                    })
                }
            } else {
                setLoading(false)
                setError('Cannot send an empty message')
            }
        }
    }

    const handleFocus = useCallback(() => {
        chatInptRef?.current?.focus()
    }, [])

    useEffect(() => {
        handleFocus()
    }, [handleFocus])

    useEffect(() => {
        if (content === '') {
            handleFocus()
        }
    }, [content, handleFocus])

    return (
        <div className="bg-[#ebedef] flex items-center gap-4 dark:bg-[#383a40] w-[77%] h-[44px] px-4 py-[11px] rounded-lg fixed bottom-4">
            <div onClick={() => openModal('ATTACH_FILE', type === 'CONVERSATION' ? { conversationId: params.conversationId, senderId: params.senderId, recieverId: params.recieverId, type: 'CONVERSATION' } : { type: 'CHANNEL' })} className='p-1 cursor-pointer'>
                <Plus width={20} height={20} className='bg-[#4e5058] text-white dark:bg-[#b5bac1] dark:text-[#383a40] rounded-full' />
            </div>
            <input
                ref={chatInptRef}
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
                <EmojiPicker onSelect={(value: string) => setContent(prev => `${prev}${value}`)} />
            </div>
            {error && (
                <div className="text-red-500 text-sm absolute bottom-16">
                    {error}
                </div>
            )}
        </div>
    )
}
