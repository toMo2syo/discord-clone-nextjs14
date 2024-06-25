'use server'

import { CreateChannelFormSchema, CreateFriendRequestSchema, CreateServerformSchema, ServerformDataType } from './definition'
import { db } from "./db"
import { cache } from "react"
import { currentProfile } from './current-profile'
import { ServerRoleType, Server, Channel, Profile, FriendRequestStatus } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { v4 as uuidv4 } from 'uuid';
import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import { fetchConversation } from './conversation'


//get intial servers when a user log in
export const fetchServers = cache(async () => {
    const profile = await currentProfile()
    if (!profile) {
        return redirect('/sign-in')
    }
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

//get current login user
export async function fetchCurrentProfile() {
    const profile = await currentProfile()
    return profile
}

//fetch the first channel of the first server the user is a member of
export async function fetchDefaultChannel() {
    await new Promise(resolve => setTimeout(resolve, 1000));
    try {
        const profile = await currentProfile();
        if (!profile) {
            return null;
        }

        const membership = await db.serverMembership.findFirst({
            where: {
                profileId: profile.profileId,
            },
            orderBy: {
                createdAt: 'asc',
            },
            include: {
                server: {
                    include: {
                        channels: {
                            orderBy: {
                                createdAt: 'asc',
                            },
                            take: 1,
                        },
                    },
                },
            },
        });

        if (membership && membership.server && membership.server.channels.length > 0) {
            return membership.server;
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

    let server: Server | null = null
    try {
        // await new Promise(resolve => setTimeout(resolve, 2000))
        const profile = await currentProfile()
        if (profile) {
            server = await db.server.create({
                data: {
                    ownerId: profile.profileId,
                    serverName: servername,
                    imageUrl: imageUrl || null,
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
                ownerId: profile?.profileId
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
        if (!profile) {
            return auth().redirectToSignIn()
        }
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
        const profile = await currentProfile();
        if (!profile) {
            throw new Error('Failed to fetch current profile');
        }
        const role = await db.serverMembership.findUnique({
            where: {
                serverId_profileId: {
                    serverId: id,
                    profileId: profile?.profileId,
                }
            }
        });
        return role?.serverRole;
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
                ownerId: profile?.profileId
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
    if (!profile) {
        return null
    }
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
        console.error(error);
        throw new Error(`Fail to fetch members with server id ${id}`)
    }
}

//update role
export async function updateServerRole(serverId: string, memberId: string, role: ServerRoleType) {
    const profile = await currentProfile()
    if (!profile) {
        return null
    }
    // Get the role of the current user
    const currentUserMembership = await db.serverMembership.findUnique({
        where: {
            serverId_profileId: {
                serverId: serverId,
                profileId: profile.profileId,
            },
        },
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
            },
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
        if (!profile) {
            return null
        }
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

    try {
        const profile = await currentProfile();
        if (!profile) {
            return null
        }
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
        if (!profile) {
            return null
        }
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
} | null | undefined
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
        if (!profile) {
            return null
        }
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
    revalidatePath(`/server/${serverId}/${newChannel.channelId}`)
    redirect(`/server/${serverId}/${newChannel.channelId}`)
}

//get channel by its id
export async function fetchChannelById(id: string) {
    try {
        const channel = await db.channel.findUnique({
            where: {
                channelId: id
            },
        })
        return channel
    } catch (error) {
        throw new Error(`Fail to fetch channel with id ${id}`)
    }
}

//delete channel
export async function deleteChannel(serverId: string, channelId: string) {
    try {
        const profile = await currentProfile();
        if (!profile) {
            return null
        }
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

    if (!safeFormData.success) {
        return {
            errors: safeFormData.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update Channel'
        }
    }

    try {
        const profile = await currentProfile()
        if (!profile) {
            return null
        }
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
    // redirect(`/server/${serverId}/${channelId}`)
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

//find the first member of a server
export async function fetchFirstMembeById(id: string) {
    try {
        const profile = await currentProfile()
        if (!profile) {
            return null
        }
        const member = await db.serverMembership.findFirst({
            where: {
                serverId: id,
                profileId: profile.profileId
            },
            include: {
                profile: true,
            }
        })
        if (!member) {
            return null
        }
        return {
            profile: member?.profile,
            role: member?.serverRole
        }
    } catch (error) {
        console.error(error);
        throw new Error(`Failed to fetch member with serverId: ${id}`)
    }
}

//initialize conversation
export async function initializeConversation(serverId: string, memberId: string) {
    //get the current profile
    const profile = await currentProfile()
    if (!profile) {
        return auth().redirectToSignIn()
    }

    //
    const currentMember = await db.serverMembership.findFirst({
        where: {
            serverId,
            profileId: memberId
        }
    })

    if (!currentMember) {
        return redirect('/server')
    }

    const conversation = await fetchConversation(profile.profileId, memberId)
    if (!conversation) {
        return redirect(`/server/${serverId}`)
    }
    const { initiator, reciever } = conversation
    const other = initiator.profileId === profile.profileId ? reciever : initiator
    return { other, conversationId: conversation.conversationId }
}

//fetch gorup messages
export async function fetchGroupMessages({ channelId, limit, cursor }: {
    channelId: string,
    limit: number,
    cursor?: string | null
}) {
    try {
        const messages = await db.groupMessage.findMany({
            where: {
                channelId
            },
            take: limit + 1, // Fetch one extra item to check if there is a next page
            skip: cursor ? 1 : 0,
            cursor: cursor ? { messageId: cursor } : undefined,
            include: {
                member: {
                    include: {
                        profile: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
        const nextCursor = messages.length > limit ? messages.pop()?.messageId : null;

        return { messages, nextCursor };
    } catch (error) {
        console.error("[FETCH MESSAGE ERROR]", error)
    }
}

//fetch one-on-one message
export async function fetchDirectMessages({ conversationId, limit, cursor }: {
    conversationId: string,
    limit: number,
    cursor?: string | null
}) {
    try {
        const messages = await db.directMessage.findMany({
            where: {
                conversationId
            },
            take: limit + 1, // Fetch one extra item to check if there is a next page
            skip: cursor ? 1 : 0,
            cursor: cursor ? { messageId: cursor } : undefined,
            include: {
                sender: true,
                receiver: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        const nextCursor = messages.length > limit ? messages.pop()?.messageId : null;

        return { messages, nextCursor };
    } catch (error) {
        console.error("[FETCH DIRECT MESSAGE ERROR]", error);
        return { messages: [], nextCursor: null };
    }
}

//create friend request
export type CreateFriendRequestState = {
    errors?: {
        email?: string[];
    };
    message?: string | null,
    success?: boolean
} | null | undefined
export async function createFriendRequest(prevState: CreateFriendRequestState, formData: FormData) {
    const rowFormData = {
        email: formData.get('email')
    }
    const safeFormData = CreateFriendRequestSchema.safeParse(rowFormData)

    if (!safeFormData.success) {
        return {
            errors: safeFormData.error.flatten().fieldErrors,
            message: 'Missing Fields.Failed to Create Server',
            success: safeFormData.success
        }

    }
    try {
        //get the current user(profile)
        const profile = await currentProfile()

        if (!profile) {
            return auth().redirectToSignIn()
        }

        // Check if the receiver exists
        const reciever = await db.profile.findUnique({
            where: {
                email: safeFormData.data.email
            }
        })

        if (!reciever) {
            return {
                message: 'Receiver does not exist.',
                success: false
            }
        }

        if (profile.profileId === reciever.profileId) {
            return {
                message: 'You always be a friend of youself',
                success: false
            }
        }

        //Check if there's already a friend request
        const existingRequest = await db.friendRequest.findFirst({
            where: {
                OR: [
                    { senderId: profile.profileId, receiverId: reciever.profileId },
                    { senderId: reciever.profileId, receiverId: profile.profileId },
                ],
            },
        });

        if (existingRequest) {
            // If a request exists but its status is IGNORED, update it to PENDING
            if (existingRequest.status === 'IGNORED') {
                const updatedRequest = await db.friendRequest.update({
                    where: {
                        requestId: existingRequest.requestId
                    },
                    data: {
                        status: 'PENDING'
                    }
                });
                return {
                    message: 'Friend request send sucessfully.',
                    success: true
                }
            } else {
                return {
                    message: 'Friend request already exists.',
                    success: false
                }
            }
        }
        // Check if the friendProfileId is a friend of the current profile
        const friendRecord = await db.friend.findFirst({
            where: {
                OR: [
                    { profileId: profile.profileId, friendProfileId: reciever.profileId },
                    { profileId: reciever.profileId, friendProfileId: profile.profileId }
                ]
            }
        });
        if (friendRecord) {
            return {
                message: 'You are already friends',
                success: false
            }
        }
        // Create the friend request
        const newFriendRequest = await db.friendRequest.create({
            data: {
                senderId: profile.profileId,
                receiverId: reciever.profileId,
                status: FriendRequestStatus.PENDING
            },
        });
        if (newFriendRequest) {
            return {
                message: 'Friend request send sucessfully.',
                success: true
            }
        }

    } catch (error) {
        console.error('Error creating friend request:', error);
        throw error;
    }
}

//fetch pending friend request
export async function fetchPendingFriendRequests() {
    try {
        // Check if the user exists
        const profile = await currentProfile()

        if (!profile) {
            return auth().redirectToSignIn()
        }

        // Fetch pending friend requests where the user is the sender or the receiver
        const pendingRequests = await db.friendRequest.findMany({
            where: {
                receiverId: profile.profileId,
                status: FriendRequestStatus.PENDING
            },
            include: {
                sender: true,  // Include sender profile details
            },
        });

        return pendingRequests;
    } catch (error) {
        console.error('Error fetching pending friend requests:', error);
        throw error;
    }
}

//ignore friend request
export async function ignoreFriendRquest(requestId: string, senderId: string) {
    if (!requestId || !senderId) {
        throw new Error('Missing sender ID or request ID')
    }
    try {
        //get the current profile
        const profile = await currentProfile()
        if (!profile) {
            return auth().redirectToSignIn()
        }

        //Check if there's a pending or accepted friend request
        const existingRequest = await db.friendRequest.findFirst({
            where: {
                OR: [
                    { senderId: senderId, receiverId: profile.profileId },
                    { senderId: profile.profileId, receiverId: senderId },
                ],
                status: FriendRequestStatus.PENDING,
            },
        });

        if (!existingRequest) {
            throw new Error('Friend Request does not exist')
        }

        // Update the friend request status to IGNORED
        await db.friendRequest.update({
            where: { requestId },
            data: { status: FriendRequestStatus.IGNORED },
        });
    } catch (error) {
        console.error('Error ignoring friend request:', error);
        throw error;
    }
    revalidatePath('/friend/pending')
}
//accept friend request
export async function acceptFriendRquest(requestId: string, senderId: string) {
    if (!requestId || !senderId) {
        throw new Error('Missing sender ID or request ID')
    }
    try {
        //get the current profile
        const profile = await currentProfile()
        if (!profile) {
            return auth().redirectToSignIn()
        }

        //Check if there's a pending or accepted friend request
        const existingRequest = await db.friendRequest.findFirst({
            where: {
                OR: [
                    { senderId: senderId, receiverId: profile.profileId },
                    { senderId: profile.profileId, receiverId: senderId },
                ],
                status: FriendRequestStatus.PENDING,
            },
        });

        if (!existingRequest) {
            throw new Error('Friend Request does not exist')
        }

        // delete the friendRequest
        await db.friendRequest.delete({
            where: { requestId },
        });

        // Create a new friend relationship
        await db.friend.create({
            data: {
                profileId: profile.profileId,
                friendProfileId: senderId,
                isBlockedByProfile: false,
                isBlockedByFriend: false,
            },
        });
    } catch (error) {
        console.error('Error ignoring friend request:', error);
        throw error;
    }
    revalidatePath('/friend/pending')
    revalidatePath('/friend/all')
}

//fetch all friends
export async function fetchFriends() {
    try {
        const profile = await currentProfile()
        if (!profile) {
            return auth().redirectToSignIn()
        }
        const friends = await db.friend.findMany({
            where: {
                OR: [
                    { profileId: profile.profileId },
                    { friendProfileId: profile.profileId },
                ],
                isBlockedByFriend: false
            },
            include: {
                profile: true,
                friendProfile: true
            }
        })
        return friends?.map(friend => {
            if (friend.profileId === profile.profileId) {
                return friend.friendProfile;
            } else {
                return friend.profile;
            }
        })
    } catch (error) {
        console.error('Error fetching friends:', error);
        throw error;
    }
}

//fetch online friends
export async function fetchOnlineFriends() {
    try {
        const profile = await currentProfile();
        if (!profile) {
            return auth().redirectToSignIn();
        }
        // Fetch friends where either profileId or friendProfileId matches the current user's profileId
        const friends = await db.friend.findMany({
            where: {
                OR: [
                    { profileId: profile.profileId },
                    { friendProfileId: profile.profileId }
                ],
                AND: [
                    {
                        isBlockedByProfile: false,
                        isBlockedByFriend: false
                    }
                ]
            },
            include: {
                profile: true,
                friendProfile: true
            }
        });

        // Filter friends to only include those who are online
        const onlineFriends = friends.map(friend => {
            if (friend.profileId === profile.profileId && friend.friendProfile.status === 'ONLINE') {
                return friend.friendProfile;
            }
            if (friend.friendProfileId === profile.profileId && friend.profile.status === 'ONLINE') {
                return friend.profile;
            }
        }).filter(Boolean); // Filter out undefined values

        return onlineFriends;
    } catch (error) {
        console.error('Error fetching online friends:', error);
        throw error;
    }
}
//delete friend
export async function deleteFriendById(id: string) {
    if (!id) {
        throw new Error('Missing Friend Id')
    }
    try {
        const profile = await currentProfile()
        if (!profile) {
            return auth().redirectToSignIn()
        }
        // Check if the friendProfileId is a friend of the current profile
        const friendRecord = await db.friend.findFirst({
            where: {
                OR: [
                    { profileId: profile.profileId, friendProfileId: id },
                    { profileId: id, friendProfileId: profile.profileId }
                ]
            }
        });
        if (!friendRecord) {
            throw new Error("This user is not your friend.");
        }

        // Delete the friend record
        await db.friend.delete({
            where: {
                friendId: friendRecord.friendId
            }
        });

    } catch (error) {
        console.error('Error deleting friend:', error);
        throw error;
    }
    revalidatePath('/friend/all')
    revalidatePath('/friend/online')
}

//initialize friend conversation
export async function initializeFriendConversation(friendId: string) {
    if (!friendId) {
        throw new Error('Missing Friend ID')
    }
    //get the current profile
    const profile = await currentProfile()
    if (!profile) {
        return auth().redirectToSignIn()
    }
    const conversation = await fetchConversation(profile.profileId, friendId)
    const { initiator, reciever } = conversation
    const other = initiator.profileId === profile.profileId ? reciever : initiator
    return { other, conversationId: conversation.conversationId }
}

//fetch conversation list
export async function fetchConversationsWithFriends() {
    try {
        const profile = await currentProfile();
        if (!profile) {
            return auth().redirectToSignIn();
        }

        // Fetch conversations where the current profile is either the initiator or the receiver
        const conversations = await db.conversation.findMany({
            where: {
                OR: [
                    { initiatorId: profile.profileId },
                    { recieverId: profile.profileId }
                ]
            },
            include: {
                initiator: true,
                reciever: true
            }
        });

        // Extract the friend's profile from each conversation
        const friendsProfiles = conversations.map(conversation => {
            if (conversation.initiatorId === profile.profileId) {
                return conversation.reciever;
            }
            if (conversation.recieverId === profile.profileId) {
                return conversation.initiator;
            }
        });

        return friendsProfiles;
    } catch (error) {
        console.error('Error fetching conversations:', error);
        throw error;
    }
}