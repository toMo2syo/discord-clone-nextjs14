import { auth, currentUser } from '@clerk/nextjs/server';
import { db } from '@/app/lib/db';

export async function currentProfile() {
    const { userId, redirectToSignIn } = auth();

    if (!userId) {
        console.error('No user ID found. Redirecting to sign-in.');
        return redirectToSignIn();
    }

    try {
        let profile = await db.profile.findUnique({
            where: {
                profileId: userId
            }
        });

        if (!profile) {
            console.log('Profile not found, creating initial profile...');
            profile = await initialProfile();
            console.log('Profile created successfully:', profile);
        }

        return profile;
    } catch (error) {
        console.error('Error fetching profile:', error);
        throw new Error('Failed to fetch current profile');
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
        let existingProfile = await db.profile.findUnique({
            where: {
                profileId: user.id
            }
        });

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

        console.log('New profile created successfully:', newProfile);

        // Check once more to ensure profile creation
        existingProfile = await db.profile.findUnique({
            where: {
                profileId: user.id
            }
        });

        if (existingProfile) {
            return existingProfile;
        }
        return newProfile;

    } catch (error) {
        console.error('Error initializing profile:', error);
        throw new Error("Failed to initialize profile. Please try again later.");
    }
}
