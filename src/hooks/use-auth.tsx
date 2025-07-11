
"use client";

import React, { useState, useEffect, useContext, createContext, useCallback } from 'react';
import { User, onAuthStateChanged, signOut as firebaseSignOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirebase } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useToast } from './use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<{ success: boolean, message?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();
  
  const { auth: firebaseAuth } = getFirebase();

  useEffect(() => {
    if (!firebaseAuth) {
        setLoading(false);
        return;
    }
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
        setUser(user);
        setLoading(false);
    });
    return () => unsubscribe();
  }, [firebaseAuth]);

  const signInWithGoogle = useCallback(async () => {
    if (!firebaseAuth) {
      return { success: false, message: "Authentication is not configured." };
    }
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(firebaseAuth, provider);
      return { success: true };
    } catch (error: any) {
      console.error("Google Sign-In Error:", error);
      let message = "An unknown error occurred during sign-in.";
      if (error.code === 'auth/popup-closed-by-user') {
        message = "Sign-in popup closed before completion.";
      }
      return { success: false, message };
    }
  }, [firebaseAuth]);

  const signOut = useCallback(async () => {
    if (!firebaseAuth) {
        toast({ title: "Error", description: "Authentication is not configured.", variant: "destructive" });
        return;
    }
    try {
      await firebaseSignOut(firebaseAuth);
      router.push('/login');
    } catch (error: any) {
      toast({ title: "Sign Out Failed", description: error.message, variant: "destructive" });
    }
  }, [firebaseAuth, router, toast]);

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
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
