'use server'

import { CreateChannelFormSchema, CreateServerformSchema, ServerformDataType } from './definition'
import { db } from "./db"
import { cache } from "react"
import { currentProfile } from './current-profile'
import { ServerRoleType, Server, Channel } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { v4 as uuidv4 } from 'uuid';
import { redirect } from 'next/navigation'


//get intial servers when a user log in
export const fetchServers = cache(async () => {
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

//get the first channel of first created server of current user
export async function fetchDefaultChannel() {
    try {
        const profile = await currentProfile();

        if (!profile) {
            throw new Error("User not authenticated");
        }

        const newestServer = await db.server.findFirst({
            where: {
                ownerId: profile.profileId,
            },
            orderBy: {
                createdAt: 'asc',
            },
            include: {
                channels: {
                    orderBy: {
                        createdAt: 'asc',
                    },
                    take: 1,
                },
            },
        });

        if (newestServer && newestServer.channels.length > 0) {
            console.log(newestServer);
            return newestServer
        }

        return null; // Return null if there's no server or channel found
    } catch (error) {
        console.error("Error fetching default channel:", error);
        throw error;
    }
}

// create server
export async function createServer({ servername, imageUrl }: ServerformDataType) {
    const validatedFields = CreateServerformSchema.safeParse({
        servername,
        imageUrl
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields.Failed to Create Server'
        }
    }
    console.log(validatedFields);

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

//update server
export async function updateServerById(id: string, { servername, imageUrl }: ServerformDataType) {
    const profile = await currentProfile()
    const validatedFields = CreateServerformSchema.safeParse({
        servername,
        imageUrl
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields.Failed to Create Server'
        }
    }
    let server: Server | null = null
    try {
        server = await db.server.update({
            where: {
                serverId: id,
                ownerId: profile.profileId
            },
            data: {
                serverName: servername,
                imageUrl
            },
            include: {
                channels: true
            }
        })
    } catch (error) {
        console.error(error);
        throw new Error(`Failed to update server,server id ${id}`)
    }
    const serverWithChannels = server as Server & { channels: Channel[] };
    revalidatePath(`/server/${serverWithChannels.serverId}/${serverWithChannels.channels[0].channelId}`)
    redirect(`/server/${serverWithChannels.serverId}/${serverWithChannels.channels[0].channelId}`)
}

//get server by its id
export async function fetchServerById(id: string) {
    try {
        console.log('Fetching server from database with ID:', id)  // Debug log
        const server = await db.server.findUnique({
            where: {
                serverId: id
            }
        })

        return server
    } catch (error) {
        console.error(error);
        throw new Error(`Failed to fetch server,server id ${id}`)
    }
}

//Fetch the owner of a server by server ID
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

// Fetch profile by server ID
// export async function fetchProfileByServerId(id: string) {
//     try {
//         const profile = await currentProfile();
//         const server = await db.server.findUnique({
//             where: {
//                 serverId: id,
//             },
//             include: {
//                 owner: true,
//                 memberships: {
//                     include: {
//                         profile: true,
//                     },
//                 },
//             },
//         });

//         if (!server) {
//             return null;
//             // throw new Error(`Server with ID ${id} not found`);
//         }

//         return {
//             owner: server.owner,
//             members: server.memberships.map(membership => ({
//                 profile: membership.profile,
//                 role: membership.serverRole,
//             })),
//         };
//     } catch (error) {
//         console.error(error);
//         throw new Error(`Failed to fetch profile and server owner by id ${id}`);
//     }
// }

//get the server role of a specific server for a profile
export async function fetchRoleByServerId(id: string) {
    try {
        const profile = await currentProfile();
        if (!profile) {
            throw new Error('Failed to fetch current profile');
        }
        const role = await db.serverMembership.findUnique({
            where: {
                serverId_profileId: {
                    serverId: id,
                    profileId: profile.profileId,
                }
            }
        });
        if (!role) {
            return null;
        }
        return role.serverRole;
    } catch (error) {
        console.error(error);
        throw new Error(`Failed to fetch server role by ID ${id}`);
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
            },
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

//get the members (profiles) of a server along with their roles
export async function fetchServerMembersById(id: string) {
    try {
        const membersWithRoles = await db.serverMembership.findMany({
            where: {
                serverId: id
            },
            include: {
                profile: true,
            }
        })
        const membersWithRolesFormatted = membersWithRoles.map(membership => ({
            profile: membership.profile,
            role: membership.serverRole
        }));

        // Define the priority for each role
        const rolePriority = {
            ADMIN: 1,
            MODERATOR: 2,
            GUEST: 3,
        };

        // Sort the members based on role priority
        membersWithRolesFormatted.sort((a, b) => {
            return rolePriority[a.role] - rolePriority[b.role];
        });

        return membersWithRolesFormatted
    } catch (error) {
        console.log(error);
        throw new Error(`Fail to fetch members with server id ${id}`)
    }
}

//update role
export async function updateServerRole(serverId: string, memberId: string, role: ServerRoleType) {
    const profile = await currentProfile()
    // Get the role of the current user
    const currentUserMembership = await db.serverMembership.findUnique({
        where: {
            serverId_profileId: {
                serverId: serverId,
                profileId: profile.profileId,
            }
        }
    });

    if (!currentUserMembership || currentUserMembership.serverRole !== 'ADMIN') {
        throw new Error('Permission Denied: Only admins can change role');
    }

    if (memberId === profile.profileId) {
        throw new Error('You can not change the role of your own');
    }

    try {
        await db.serverMembership.update({
            where: {
                serverId_profileId: {
                    serverId: serverId,
                    profileId: memberId,
                }
            },
            data: {
                serverRole: role
            }
        })
    } catch (error) {
        console.error(error);
        throw new Error(`Failed to update server role for member ${memberId} in server ${serverId}`);
    }
    revalidatePath(`/server/${serverId}`)
    // redirect(`/server/${serverId}`)
}

//kick member
export async function removeMemberFromServer(serverId: string, memberId: string) {
    try {
        const profile = await currentProfile()
        // Get the role of the current user
        const currentUserMembership = await db.serverMembership.findUnique({
            where: {
                serverId_profileId: {
                    serverId: serverId,
                    profileId: profile.profileId,
                }
            }
        });

        if (!currentUserMembership || currentUserMembership.serverRole !== 'ADMIN') {
            throw new Error('Permission Denied: Only admins can kick members.');
        }

        // Get the role of the member to be kicked
        const memberToKick = await db.serverMembership.findUnique({
            where: {
                serverId_profileId: {
                    serverId: serverId,
                    profileId: memberId,
                }
            }
        });

        if (!memberToKick) {
            throw new Error('Member not found in the server.');
        }

        if (memberToKick.serverRole === 'ADMIN') {
            throw new Error('Cannot kick an admin.');
        }

        // Proceed to remove the member
        await db.serverMembership.delete({
            where: {
                serverId_profileId: {
                    serverId: serverId,
                    profileId: memberId,
                }
            }
        });

    } catch (error) {
        console.error(error);
        throw new Error(`Failed to kick member: ${error}`);
    }
    revalidatePath(`/server/${serverId}`)
}

//leave server
export async function leaveServer(serverId: string) {
    console.log('called');

    try {
        const profile = await currentProfile();

        // Check if the user is the admin of the server
        const membership = await db.serverMembership.findUnique({
            where: {
                serverId_profileId: {
                    serverId: serverId,
                    profileId: profile.profileId
                }
            },
            include: {
                server: true
            }
        });
        console.log(membership);

        if (!membership) {
            throw new Error('Membership not found');
        }

        if (membership.serverRole === ServerRoleType.ADMIN) {
            throw new Error('Admins cannot leave the server');
        }

        //Delete the ServerMembership record
        await db.serverMembership.delete({
            where: {
                serverId_profileId: {
                    serverId: serverId,
                    profileId: profile.profileId
                }
            }
        });
    } catch (error) {
        console.error(error);
        throw new Error(`Failed to leave server: ${error}`);
    }
    revalidatePath('/server')
    redirect('/server')
}

//delete server
export async function deleteServer(serverId: string) {
    try {
        const profile = await currentProfile();

        //Check if the user is the admin of the server
        const server = await db.server.findUnique({
            where: {
                serverId: serverId,
            },
            include: {
                owner: true,
            },
        });

        if (!server) {
            throw new Error('Server not found');
        }

        if (server.ownerId !== profile.profileId) {
            throw new Error('Only the admin can delete the server');
        }

        //Delete the server
        await db.server.delete({
            where: {
                serverId: serverId,
            },
        });
    } catch (error) {
        console.error(error);
        throw new Error(`Failed to delete server: ${error}`);
    }
    revalidatePath('/server')
    redirect('/server')
}

//create channel
export type CreateChannelState = {
    errors?: {
        name?: string[];
        type?: string[]
    };
    message?: string | null
} | undefined
export async function createChannel(serverId: string, prevState: CreateChannelState, formData: FormData) {
    const rowFormData = {
        name: formData.get('channelName'),
        type: formData.get('type')
    }
    const safeFormData = CreateChannelFormSchema.safeParse(rowFormData)
    if (!safeFormData.success) {
        return {
            errors: safeFormData.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Channel'
        }
    }
    if (!serverId) {
        throw new Error('Missing serverId')
    }
    let newChannel: null | Channel = null
    // await new Promise(resolve => setTimeout(resolve, 2000))
    try {
        const profile = await currentProfile()
        //Check if the user has the necessary role
        const membership = await db.serverMembership.findFirst({
            where: {
                serverId: serverId,
                profileId: profile.profileId,
                serverRole: {
                    in: [ServerRoleType.ADMIN, ServerRoleType.MODERATOR]
                }
            }
        });

        if (!membership) {
            throw new Error('Permission Denied: Only admins and moderators can create channels.');
        }

        //Create the channel
        newChannel = await db.channel.create({
            data: {
                channelName: safeFormData.data.name,
                channelType: safeFormData.data.type,
                server: {
                    connect: { serverId: serverId }
                }
            }
        });

    } catch (error) {
        console.error(error);
        throw new Error(`Failed to create channel: ${error}`);
    }
    console.log(newChannel.channelId)
    revalidatePath(`/server/${serverId}/${newChannel.channelId}`)
    redirect(`/server/${serverId}/${newChannel.channelId}`)
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

//delete channel
export async function deleteChannel(serverId: string, channelId: string) {
    try {
        const profile = await currentProfile();

        //Check if the user is the admin of the server
        await db.server.update({
            where: {
                serverId: serverId,
                memberships: {
                    some: {
                        profileId: profile.profileId,
                        serverRole: {
                            in: [ServerRoleType.ADMIN, ServerRoleType.MODERATOR]
                        }
                    }
                }
            },
            data: {
                channels: {
                    delete: {
                        channelId: channelId,
                        channelName: {
                            not: 'general'
                        }
                    }
                }
            }

        });

    } catch (error) {
        console.error(error);
        throw new Error(`Failed to delete server: ${error}`);
    }
    revalidatePath(`/server/${serverId}`)
    redirect(`/server/${serverId}`)
}

//update channel
export async function updateChannel(serverId: string, channelId: string, prevState: CreateChannelState, formData: FormData) {
    const rowFormData = {
        name: formData.get('channelName'),
        type: formData.get('type')
    }
    const safeFormData = CreateChannelFormSchema.safeParse(rowFormData)
    console.log(safeFormData);

    if (!safeFormData.success) {
        return {
            errors: safeFormData.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update Channel'
        }
    }

    try {
        const profile = await currentProfile()
        //Check if the user has the necessary role
        await db.server.update({
            where: {
                serverId: serverId,
                memberships: {
                    some: {
                        profileId: profile.profileId,
                        serverRole: {
                            in: [ServerRoleType.ADMIN, ServerRoleType.MODERATOR]
                        }
                    }
                }
            },
            data: {
                channels: {
                    update: {
                        where: {
                            channelId: channelId,
                        },
                        data: {
                            channelName: safeFormData.data.name
                        }
                    }
                }
            }

        });

    } catch (error) {
        console.error(error);
        throw new Error(`Failed to update channel: ${error}`);
    }
    revalidatePath(`/server/${serverId}/${channelId}`)
    redirect(`/server/${serverId}/${channelId}`)
}

//get members of a server
export async function fetchMembersById(serverId: string) {
    try {
        const members = await db.serverMembership.findMany({
            where: {
                serverId: serverId
            },
            include: {
                profile: true
            }
        });

        return members.map(member => member.profile);
    } catch (error) {
        console.error('Error fetching server members:', error);
        throw new Error('Failed to fetch server members');
    }
}
