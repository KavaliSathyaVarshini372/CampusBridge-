
'use server';

import { getApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { isFirebaseEnabled, app } from '@/lib/firebase';
import { z } from 'zod';

const SignUpSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6, "Password must be at least 6 characters long."),
});

const SignInSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export async function signUpWithEmail(formData: FormData) {
    if (!isFirebaseEnabled) {
        return { success: false, message: 'Firebase is not enabled.' };
    }
    
    const validatedFields = SignUpSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!validatedFields.success) {
        return { success: false, message: 'Invalid form data.' };
    }
    
    const { email, password } = validatedFields.data;
    
    try {
        const auth = getAuth(app);
        await createUserWithEmailAndPassword(auth, email, password);
        return { success: true, message: 'Sign up successful!' };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export async function signInWithEmail(formData: FormData) {
    if (!isFirebaseEnabled) {
        return { success: false, message: 'Firebase is not enabled.' };
    }

    const validatedFields = SignInSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!validatedFields.success) {
        return { success: false, message: 'Invalid form data.' };
    }

    const { email, password } = validatedFields.data;

    try {
        const auth = getAuth(app);
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        
        const isAdmin = userCredential.user.email === 'admin@example.com';
        
        return { success: true, message: 'Sign in successful!', isAdmin };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}
