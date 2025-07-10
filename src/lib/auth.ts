
'use server'
import { headers } from 'next/headers'

// This is a temporary utility to get user info in server actions
// A more robust solution would use NextAuth.js or JWTs.
export async function getAuthenticatedUser() {
    const headersList = headers();
    const userPayload = headersList.get('x-user-payload');

    if (!userPayload) {
        return null;
    }

    try {
        const user = JSON.parse(userPayload);
        // A simple check for admin role
        if (user.email === 'admin@example.com') {
            user.role = 'admin';
        } else {
            user.role = 'user';
        }
        return user;
    } catch (error) {
        console.error("Failed to parse user payload:", error);
        return null;
    }
}
