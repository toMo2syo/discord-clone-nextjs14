import { auth, currentUser } from '@clerk/nextjs/server';
import { db } from './db';
import { unstable_noStore as noStore } from 'next/cache';


export async function currentProfile() {
    noStore()
    const { userId } = auth();

    if (!userId) {
        return null
    }

    try {
        let profile = await db.profile.findUnique({
            where: {
                profileId: userId
            }
        });

        return profile;
    } catch (error) {
        console.error('Error fetching profile:', error);
        throw new Error('Failed to fetch current profile');
    }
}


export async function findProfile(id: string) {
    try {
        let existingProfile = await db.profile.findUnique({
            where: {
                profileId: id
            }
        });
        return existingProfile
    } catch (error) {
        console.error(error);
        throw new Error(`Fail to Find Profile with Id: ${id}`);
    }
}

export async function initialProfile() {
    const user = await currentUser();

    const { redirectToSignIn } = auth();

    if (!user) {
        console.error('No user found. Redirecting to sign-in.');
        return redirectToSignIn();
    }

    try {
        let existingProfile = await findProfile(user.id)

        if (existingProfile) {
            return existingProfile;
        }

        const newProfile = await db.profile.create({
            data: {
                profileId: user.id,
                name: `${user.firstName} ${user.lastName}`,
                avatarUrl: user.imageUrl,
                email: user.emailAddresses[0].emailAddress,
                lastOnlineTime: new Date()
            }
        });

        return newProfile;

    } catch (error) {
        console.error('Error initializing profile:', error);
        throw new Error("Failed to initialize profile. Please try again later.");
    }
}
