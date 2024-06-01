import { z } from "zod"

export const CreateServerformSchema = z.object({
    servername: z.string().min(3, { message: 'Server name must have at least 3 characters' }),
    imageUrl: z.string().url({ message: 'Server image is required' })
})
export type ServerformDataType = z.infer<typeof CreateServerformSchema>

enum UserStatus {
    'ONLINE',
    'OFFLINE',
    'IDLE'
}
export enum ChannelType {
    TEXT = 'TEXT',
    AUDIO = 'AUDIO',
    VIDEO = 'VIDEO'
}

export type Channel = {
    channelId: string
    serverId: string
    channelName: string
    channelType: ChannelType
}

export type User = {
    userId: String
    username: String
    email: String
    password: String
    avatarUrl?: String
    introduction?: String
    status?: UserStatus
    lastOnlineTime?: Date
};
