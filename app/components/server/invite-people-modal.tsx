'use client'
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ModalType } from "./server-menu";
import { Button } from "@/components/ui/button";
import { Check, Copy, RefreshCcw } from "lucide-react";
import { usePathname } from "next/navigation";
import { fetchServerInviteCodeById, updateServerInviteCode } from "@/app/lib/actions";
import clsx from "clsx";

export default function InvitePeopleModal({
    isOpen,
    onClose
}: {
    isOpen: boolean,
    onClose: Dispatch<SetStateAction<ModalType>>
}) {
    const [inviteURl, setInviteURl] = useState('')
    const [copied, setCopied] = useState(false)
    const [loading, setLoading] = useState(false)
    const pathname = usePathname()
    const serverId = pathname.split('/')[2]


    function onCopied() {
        navigator.clipboard.writeText(inviteURl);
        setCopied(true)
        setTimeout(() => {
            setCopied(false)
        }, 2000)
    }

    async function onGenerate() {
        setLoading(true)
        try {
            const origin = window.location.origin
            await new Promise(resolve => setTimeout(resolve, 2000))
            const newInviteCode = await updateServerInviteCode(serverId)
            setInviteURl(`${origin}/invite/${newInviteCode}`)
        } catch (error) {
            console.error('Error updating server invite code', error);
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        async function fetchServerInviteLink() {
            try {
                const origin = window.location.origin
                const inviteCode = await fetchServerInviteCodeById(serverId)
                setInviteURl(`${origin}/invite/${inviteCode}`)
            } catch (error) {
                console.error('Error fetching invite link', error)
            }
        }
        if (serverId) {
            fetchServerInviteLink()
        }
    }, [serverId])

    return (
        <Dialog open={isOpen} onOpenChange={open => onClose(open ? 'INVITE' : '')}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-center">Invite Friends</DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                    <label htmlFor="invite-link" className="block uppercase text-xs font-semibold">server invite link</label>
                    <div className="flex gap-2 mt-2">
                        <input type="text" disabled={loading} id="invite-link" readOnly value={inviteURl} className={clsx("bg-[#ebebeb] dark:bg-[#1e1f22] text-sm w-[90%] rounded-sm h-[30px] py-[5px] px-1 outline-none placeholder:text-sm", {
                            "opacity-50": loading
                        })} />
                        <Button
                            size='icon'
                            color="#fff"
                            variant="secondary"
                            className="w-[30px] h-[30px]"
                            onClick={onCopied}
                            disabled={loading}
                        >
                            {copied ? <Check width={18} height={18} className="text-green-500" /> : <Copy width={18} height={18} />}
                        </Button>
                    </div>
                </div>
                <div >
                    <Button onClick={onGenerate} disabled={loading} variant="link" size="sm" className="px-0 py-2 flex items-center gap-1">
                        <span> Generate a new link</span>
                        <RefreshCcw width={16} height={16} />
                    </Button>
                </div>
                <DialogClose className="outline-none" />
            </DialogContent>
        </Dialog>
    )
}
