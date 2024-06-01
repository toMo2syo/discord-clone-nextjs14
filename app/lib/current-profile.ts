import { auth } from '@clerk/nextjs/server'

import { db } from '@/app/lib/db'
import { initialProfile } from './initial-profile'

export async function currentProfile() {
    const { userId, redirectToSignIn } = auth()
    if (!userId) {
        return redirectToSignIn()
    }
    try {
        const profile = await db.profile.findUnique({
            where: {
                profileId: userId
            }
        })
        if (!profile) {
            return await initialProfile()
        }
        return profile
    } catch (error) {
        throw new Error(`Failed to fetch current profile`)
    }
}