import { ChannelType } from "@prisma/client"
import { z } from "zod"

export const CreateServerformSchema = z.object({
    servername: z.string().min(3, { message: 'Server name must have at least 3 characters' }),
    imageUrl: z.string().url({ message: 'Server image is required' })
})
export type ServerformDataType = z.infer<typeof CreateServerformSchema>

export const CreateChannelFormSchema = z.object({
    name: z.string().min(3, {
        message: 'Channel name must have at least 3 characters'
    }).refine(name => name !== 'general', { message: 'Channel name cannot be general' }),
    type: z.nativeEnum(ChannelType)
})