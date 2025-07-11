'use server';

import { getFirebase } from '@/lib/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';

export async function signUpWithEmail(email: string, pass: string) {
  const { auth } = getFirebase();
  if (!auth) {
    return { success: false, message: 'Authentication is not configured.' };
  }
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    return { success: true, message: 'Sign up successful!' };
  } catch (error: any) {
    console.error(error);
    const errorCode = error.code;
    let errorMessage = 'An unknown error occurred.';
    if (errorCode === 'auth/email-already-in-use') {
      errorMessage = 'This email address is already in use.';
    } else if (errorCode === 'auth/weak-password') {
      errorMessage = 'The password is too weak.';
    }
    return { success: false, message: errorMessage };
  }
}

export async function signInWithEmail(email: string, pass: string) {
    const { auth } = getFirebase();
    if (!auth) {
        return { success: false, message: 'Authentication is not configured.' };
    }
    try {
        await signInWithEmailAndPassword(auth, email, pass);
        return { success: true, message: 'Login successful!' };
    } catch (error: any) {
        console.error(error);
        const errorCode = error.code;
        let errorMessage = "An unknown error occurred.";
        if (errorCode === 'auth/user-not-found' || errorCode === 'auth/wrong-password' || errorCode === 'auth/invalid-credential') {
            errorMessage = "Invalid email or password.";
        }
        return { success: false, message: errorMessage };
    }
}
