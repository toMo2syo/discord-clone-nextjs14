'use client'
import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useEffect, useState } from "react";
import InvitePeopleModal from "../components/server/invite-people-modal";
import ManageMemberModal from "../components/server/manage-member-modal";
import CreateChannelModal from "../components/server/channel/create-channel-modal";
import DeleteServerModal from "../components/server/delete-server-modal";
import LeaveServerModal from "../components/server/leave-server-modal";
import ServerSettingModal from "../components/server/server-setting-modal";
import { useParams } from "next/navigation";
import { fetchServerById } from "../lib/actions";
import CreateServerModal from "../components/server/create-server-modal";
import AttcahFileModal from "../components/chat/attach-file-modal";
import DeleteFriendModal from "../components/friend/delete-friend-modal";

type ModalType = 'INVITE_PEOPLE' | 'SERVER_SETTING' | 'MANAGE_MEMBER' | 'CREATE_SERVER' | 'DELETE_SERVER' | 'LEAVE_SERVER' | 'CREATE_CHANNEL' | 'ATTACH_FILE' | 'DELETE_FRIEND' | '';
type ModalState = {
    modal: ModalType,
    data: any,
    openModal: (modal: ModalType, data?: any) => void,
    closeModal: () => void,
    setModal: Dispatch<SetStateAction<ModalType>>
}
const ModalContext = createContext<ModalState | undefined>(undefined)
export function ModalProvider({ children }: { children: ReactNode }) {
    const [modal, setModal] = useState<ModalType>('')
    const [data, setData] = useState<any>(null)
    const [query, setQuery] = useState<any>(null)
    const params = useParams()

    const serverId = params?.serverId as string
    const channelId = params?.channelId as string

    function openModal(modal: ModalType, query: any) {
        setModal(modal)
        setQuery(query)
    }
    function closeModal() {
        setModal('')
        setData(null)
        // setQuery(null)
    }
    function renderModal() {
        switch (modal) {
            case 'INVITE_PEOPLE': {
                return <InvitePeopleModal />
            }
            case 'CREATE_CHANNEL': {
                return <CreateChannelModal />
            }
            case 'DELETE_SERVER': {
                return <DeleteServerModal />
            }
            case 'MANAGE_MEMBER': {
                return <ManageMemberModal />
            }
            case 'LEAVE_SERVER': {
                return <LeaveServerModal />
            }
            case 'SERVER_SETTING': {
                return <ServerSettingModal />
            }
            case 'CREATE_SERVER': {
                return <CreateServerModal />
            }
            case 'ATTACH_FILE': {
                return <AttcahFileModal />
            }
            case 'DELETE_FRIEND': {
                return <DeleteFriendModal />
            }
            default:
                return null
        }
    }

    useEffect(() => {
        async function fetchData() {
            if (!modal) return
            try {
                let fetchedData = null;
                switch (modal) {
                    case 'INVITE_PEOPLE':
                    case 'CREATE_CHANNEL':
                    case 'DELETE_SERVER':
                    case 'MANAGE_MEMBER':
                    case 'LEAVE_SERVER': {
                        fetchedData = { serverId };
                        break;
                    }
                    case 'SERVER_SETTING': {
                        fetchedData = await fetchServerById(serverId);
                        break;
                    }
                    case 'ATTACH_FILE': {
                        fetchedData = { serverId, channelId, ...query }
                        break
                    }
                    case 'CREATE_SERVER': {
                        break
                    }
                    case 'DELETE_FRIEND': {
                        fetchedData = { ...query }
                        break
                    }
                    default:
                        break;
                }

                setData(fetchedData);
            } catch (error) {
                console.error('Failed to fetch data:', error);
                setData(null);
            }
        }
        fetchData();
        return () => {
            if (modal !== '') {
                closeModal()
            }
        }
    }, [modal, serverId, channelId, query]);

    return (
        <ModalContext.Provider value={{ modal, data, openModal, closeModal, setModal }}>
            {children}
            {renderModal()}
        </ModalContext.Provider>
    )
}

export function useModal() {
    const context = useContext(ModalContext)
    if (context === undefined) {
        throw new Error('useModal must be used within a ModalProvider')
    }
    return context
}