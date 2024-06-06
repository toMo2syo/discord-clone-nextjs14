import { currentUser, auth } from "@clerk/nextjs/server";
import { db } from "./db";

export async function initialProfile() {
    const user = await currentUser();

    const { redirectToSignIn } = auth();

    if (!user) {
        console.error('No user found. Redirecting to sign-in.');
        return redirectToSignIn();
    }

    try {
        const existingProfile = await db.profile.findUnique({
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

        return newProfile;

    } catch (error) {
        console.error('Error initializing profile:', error);
        throw new Error("Failed to initialize profile. Please try again later.");
    }
}
