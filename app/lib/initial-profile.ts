import { currentUser, auth } from "@clerk/nextjs/server";
import { db } from "./db";
import { ProfileStatus } from "@prisma/client";

export async function initialProfile() {
    const user = await currentUser()
    const { redirectToSignIn } = auth()

    if (!user) {
        return redirectToSignIn()
    }

    try {
        const profile = await db.profile.findUnique({
            where: {
                profileId: user.id
            }
        })

        if (profile) return profile

        const newProfile = await db.profile.create({
            data: {
                profileId: user.id,
                name: `${user.firstName} ${user.lastName}`,
                avatarUrl: user.imageUrl,
                email: user.emailAddresses[0].emailAddress,
                status: ProfileStatus.ONLINE,
                lastOnlineTime: new Date()
            }
        })
        return newProfile

    } catch (error) {
        console.error(error)
        throw new Error("Failed to initialize profile. Please try again later.");
    }
}