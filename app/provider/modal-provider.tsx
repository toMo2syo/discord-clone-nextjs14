'use client'
import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useEffect, useState } from "react";
import InvitePeopleModal from "../components/server/invite-people-modal";
import ManageMemberModal from "../components/server/manage-member-modal";
import CreateChannelModal from "../components/server/channel/create-channel-modal";
import DeleteServerModal from "../components/server/delete-server-modal";
import LeaveServerModal from "../components/server/leave-server-modal";
import ServerSettingModal from "../components/server/server-setting-modal";
import DeleteChannelModal from "../components/server/channel/delete-channel-modal";
import { usePathname } from "next/navigation";
import { fetchServerById } from "../lib/actions";
import CreateServerModal from "../components/server/create-server-modal";

type ModalType = 'INVITE_PEOPLE' | 'SERVER_SETTING' | 'MANAGE_MEMBER' | 'CREATE_SERVER' | 'DELETE_SERVER' | 'LEAVE_SERVER' | 'CREATE_CHANNEL' | 'DELETE_CHANNEL' | '';
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
    const pathname = usePathname()
    const serverId = pathname.split('/')[2]
    const channelId = pathname.split('/')[3]

    function openModal(modal: ModalType) {
        setModal(modal)
        // setData(data)
    }

    function closeModal() {
        setModal('')
        setData(null)
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
            case 'DELETE_CHANNEL': {
                return <DeleteChannelModal />
            }
            case 'CREATE_SERVER': {
                return <CreateServerModal />
            }
            default:
                return null
        }
    }

    useEffect(() => {
        async function fetchData() {
            console.log(serverId);

            if (!serverId) return
            try {
                console.log(serverId);
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
                    case 'DELETE_CHANNEL': {
                        fetchedData = { serverId, channelId };
                        break;
                    }
                    case 'CREATE_SERVER': {
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

        //close the modal when performed action in the modal
        return () => {
            if (modal !== '') {
                closeModal()
            }
        }
    }, [modal, serverId, channelId]);
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