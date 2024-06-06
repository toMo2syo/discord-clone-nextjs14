import { auth } from '@clerk/nextjs/server';
import { db } from '@/app/lib/db';
import { initialProfile } from './initial-profile';

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
            profile = await initialProfile();
        }

        return profile;
    } catch (error) {
        console.error('Error fetching profile:', error);
        throw new Error('Failed to fetch current profile');
    }
}
