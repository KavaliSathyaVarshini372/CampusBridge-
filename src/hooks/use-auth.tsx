"use client";

import React, { useState, useEffect, useContext, createContext } from 'react';
import { User, onAuthStateChanged, signOut as firebaseSignOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirebaseAuth, isFirebaseEnabled } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useToast } from './use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  isFirebaseReady: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!isFirebaseEnabled) {
      setLoading(false);
      return;
    }
    const auth = getFirebaseAuth();
    if (!auth) {
        setLoading(false);
        return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const auth = getFirebaseAuth();
    if (!auth) {
        toast({
            title: "Feature Unavailable",
            description: "Firebase is not configured. Please add credentials to the .env.local file.",
            variant: "destructive"
        });
        return;
    }
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push('/events');
    } catch (error) {
      console.error("Error signing in with Google", error);
      toast({
        title: "Sign-in Error",
        description: "Could not sign in with Google. Please try again.",
        variant: "destructive"
      });
    }
  };

  const signOut = async () => {
    const auth = getFirebaseAuth();
    if (!auth) {
      toast({
        title: "Feature Unavailable",
        description: "Firebase is not configured.",
        variant: "destructive"
      });
      return;
    }
    try {
      await firebaseSignOut(auth);
      router.push('/login');
    } catch (error) {
      console.error("Error signing out", error);
       toast({
        title: "Sign-out Error",
        description: "Could not sign out. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut, isFirebaseReady: isFirebaseEnabled }}>
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
