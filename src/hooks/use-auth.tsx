
"use client";

import React, { useState, useEffect, useContext, createContext, useCallback } from 'react';
import { User, onAuthStateChanged, signOut as firebaseSignOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, Auth } from 'firebase/auth';
import { initializeFirebase } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useToast } from './use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [firebaseAuth, setFirebaseAuth] = useState<Auth | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const { auth } = initializeFirebase();
    if (auth) {
      setFirebaseAuth(auth);
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, []);

  const signInWithEmail = useCallback(async (email: string, pass: string) => {
    if (!firebaseAuth) {
        toast({ title: "Error", description: "Authentication is not configured.", variant: "destructive" });
        return;
    }
    try {
      await signInWithEmailAndPassword(firebaseAuth, email, pass);
      router.push('/events');
      toast({ title: "Login Successful", description: "Welcome back!" });
    } catch (error: any) {
      console.error(error);
      const errorCode = error.code;
      let errorMessage = "An unknown error occurred.";
      if (errorCode === 'auth/user-not-found' || errorCode === 'auth/wrong-password' || errorCode === 'auth/invalid-credential') {
        errorMessage = "Invalid email or password.";
      }
      toast({ title: "Login Failed", description: errorMessage, variant: "destructive" });
    }
  }, [firebaseAuth, router, toast]);

  const signUpWithEmail = useCallback(async (email: string, pass: string) => {
    if (!firebaseAuth) {
        toast({ title: "Error", description: "Authentication is not configured.", variant: "destructive" });
        return;
    }
    try {
      await createUserWithEmailAndPassword(firebaseAuth, email, pass);
      router.push('/events');
      toast({ title: "Sign Up Successful", description: "Welcome to CampusBridge+!" });
    } catch (error: any) {
      console.error(error);
      const errorCode = error.code;
      let errorMessage = "An unknown error occurred.";
       if (errorCode === 'auth/email-already-in-use') {
        errorMessage = "This email address is already in use.";
      } else if (errorCode === 'auth/weak-password') {
        errorMessage = "The password is too weak.";
      }
      toast({ title: "Sign Up Failed", description: errorMessage, variant: "destructive" });
    }
  }, [firebaseAuth, router, toast]);

  const signOut = useCallback(async () => {
    if (!firebaseAuth) {
        toast({ title: "Error", description: "Authentication is not configured.", variant: "destructive" });
        return;
    }
    try {
      await firebaseSignOut(firebaseAuth);
      router.push('/events');
    } catch (error: any) {
      toast({ title: "Sign Out Failed", description: error.message, variant: "destructive" });
    }
  }, [firebaseAuth, router, toast]);

  return (
    <AuthContext.Provider value={{ user, loading, signInWithEmail, signUpWithEmail, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
