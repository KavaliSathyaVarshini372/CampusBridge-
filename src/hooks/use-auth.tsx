
"use client";

import React, { useState, useEffect, useContext, createContext, useCallback } from 'react';
import { User, onAuthStateChanged, signOut as firebaseSignOut, GoogleAuthProvider, signInWithPopup, type Auth } from 'firebase/auth';
import { auth as firebaseAuth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useToast } from './use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();
  
  useEffect(() => {
    if (!firebaseAuth) {
        console.warn("Firebase Auth is not available. Running in offline mode.");
        setLoading(false);
        return;
    }

    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
        setUser(user);
        setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = useCallback(async () => {
    if (!firebaseAuth) {
      toast({ title: "Error", description: "Authentication service is not available.", variant: "destructive" });
      return;
    }
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(firebaseAuth, provider);
      // The onAuthStateChanged listener will handle the redirect
    } catch (error: any) {
      console.error("Google Sign-In Error:", error);
      let message = "An unknown error occurred during sign-in.";
      if (error.code === 'auth/popup-closed-by-user') {
        message = "Sign-in popup closed before completion.";
      } else if (error.code === 'auth/cancelled-popup-request' || error.code === 'auth/popup-blocked') {
        message = "The sign-in popup was blocked by the browser. Please allow popups for this site.";
      }
      toast({ title: "Error", description: message, variant: "destructive" });
    }
  }, [toast]);

  const signOut = useCallback(async () => {
    if (!firebaseAuth) {
        toast({ title: "Error", description: "Authentication service is not available.", variant: "destructive" });
        return;
    }
    try {
      await firebaseSignOut(firebaseAuth);
      router.push('/login');
    } catch (error: any) {
      toast({ title: "Sign Out Failed", description: error.message, variant: "destructive" });
    }
  }, [router, toast]);

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
