'use server'

import { CreateServerformSchema, ServerformDataType } from './definition'
import { db } from "./db"
import { initialProfile } from "./initial-profile"
import { cache } from "react"
import { currentProfile } from './current-profile'
import { ServerRoleType, Server, Channel } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid';


//get all intial servers when a user log in
export const getInitialServers = cache(async () => {
    const profile = await currentProfile()
    // if (!profile) {
    //     return redirect('/')
    // }
    try {
        const servers = await db.serverMembership.findMany({
            where: {
                profileId: profile.profileId,
            },
            include: {
                server: true,
            },
            orderBy: {
                createdAt: 'asc'
            }
        })
        return servers.map(membership => membership.server);
    } catch (error) {
        console.error(error);
        throw new Error(`Failed to fetch initial servers`)
    }
})

// create server
export async function createServer({ servername, imageUrl }: ServerformDataType) {
    const validatedFields = CreateServerformSchema.safeParse({
        servername,
        imageUrl
    })

    if (!validatedFields.success) {
        console.log(validatedFields);

        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields.Failed to Create Server'
        }
    }
    let server: Server | null = null
    try {
        const profile = await currentProfile()
        if (profile) {
            server = await db.server.create({
                data: {
                    ownerId: profile.profileId,
                    serverName: servername,
                    imageUrl: imageUrl,
                    channels: {
                        create: [
                            {
                                channelName: 'general',
                            }
                        ]
                    },
                    memberships: {
                        create: [
                            {
                                profileId: profile.profileId,
                                serverRole: ServerRoleType.ADMIN
                            }
                        ]
                    }
                },
                include: {
                    channels: true
                }
            })
        }
    } catch (error) {
        console.error(error);
        throw new Error('Internal Error: Failed to create server')
    }
    const serverWithChannels = server as Server & { channels: Channel[] };
    revalidatePath(`/server/${serverWithChannels.serverId}/${serverWithChannels.channels[0].channelId}`)
    redirect(`/server/${serverWithChannels.serverId}/${serverWithChannels.channels[0].channelId}`)
}

//get the owner of a server
export async function fetchProfileByServerId(id: string) {
    try {
        const profile = await currentProfile()
        const server = await db.server.findUnique({
            where: {
                serverId: id,
                memberships: {
                    some: {
                        profileId: profile?.profileId
                    }
                }
            },
            include: {
                owner: true,
            }
        })
        if (!server) {
            return null
            // throw new Error(`Server with ID ${id} not found`);
        }
        return server.owner
    } catch (error) {
        console.error(error);
        throw new Error(`Failed to fetch profile,server owner id ${id}`)
    }
}

//get the server role of a specific server for a profile
export async function fetchRoleByServerId(id: string) {
    try {
        const profile = await currentProfile()
        const role = await db.serverMembership.findUnique({
            where: {
                serverId_profileId: {
                    serverId: id,
                    profileId: profile.profileId,
                }
            }
        })
        console.log(role);
        if (!role) {
            return null
            // throw new Error(`Membership not found for profile ID ${profile.profileId} in server ID ${id}`);
        }
        console.log(role?.serverRole);

        return role?.serverRole
    } catch (error) {
        throw new Error('Internal Error: Failed to fetch server role');
    }
}

//get all the channels of a server
export async function fetchChannels(id: string) {
    try {
        const channels = await db.channel.findMany({
            where: {
                serverId: id
            },
            orderBy: {
                createdAt: 'asc'
            }
        })
        if (channels.length === 0) {
            console.warn(`No channels found for server ID ${id}`);
        }
        return channels
    } catch (error) {
        console.error(error);
        throw new Error(`Failed to fetch channels,server id ${id}`)
    }
}

//get the default channel of a server
export async function fetchInitialChannel(id: string) {
    try {
        const channel = await db.channel.findFirst({
            where: {
                serverId: id
            },
            orderBy: {
                createdAt: 'asc'
            }
        })
        return channel
    } catch (error) {
        console.error(error);
        throw new Error(`Failed to fetch initial channel`)
    }
}

//get server invite code by its id
export async function fetchServerInviteCodeById(id: string) {
    try {
        const server = await db.server.findUnique({
            where: {
                serverId: id
            }
        })
        return server?.inviteCode
    } catch (error) {
        console.error(error);
        throw new Error(`Failed to fetch server invite link`)
    }
}

//update server invite code
export async function updateServerInviteCode(id: string) {
    try {
        const profile = await currentProfile()
        const server = await db.server.update({
            where: {
                serverId: id,
                ownerId: profile.profileId
            },
            data: {
                inviteCode: uuidv4()
            }
        })
        return server.inviteCode
    } catch (error) {
        console.error(error);
        throw new Error(`Failed to update server invite link`)
    }
}

//join a server
export async function joinServer(inviteCode: string) {
    const profile = await currentProfile()
    //check if a user is already in the server
    const existingServer = await db.server.findUnique({
        where: {
            inviteCode: inviteCode,
            memberships: {
                some: {
                    profileId: profile.profileId
                }
            }
        },
        include: {
            channels: true
        }
    })
    const serverWithChannels = existingServer as Server & { channels: Channel[] };
    if (existingServer) {
        redirect(`/server/${serverWithChannels.serverId}/${serverWithChannels.channels[0].channelId}`)
    }
    try {
        const server = await db.server.update({
            where: {
                inviteCode
            },
            data: {
                memberships: {
                    create: [
                        {
                            profileId: profile.profileId,
                            serverRole: ServerRoleType.GUEST
                        }
                    ]
                }
            }
        })
        return server
    } catch (error) {
        console.error(error);
        throw new Error(`Failed to create member`)
    }
}


//get channel by its id
export async function fetchChannelById(id: string) {
    try {
        const channel = await db.channel.findUnique({
            where: {
                channelId: id
            }
        })
        return channel
    } catch (error) {
        console.log(error);
        throw new Error(`Fail to fetch channel with id ${id}`)
    }
}

