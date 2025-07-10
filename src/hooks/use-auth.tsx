
"use client";

import React, { useState, useEffect, useContext, createContext } from 'react';
import { User, onAuthStateChanged, signOut as firebaseSignOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { isFirebaseEnabled, firebaseAuth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useToast } from './use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string) => Promise<void>;
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
    if (!firebaseAuth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signInWithEmail = async (email: string, pass: string) => {
    if (!firebaseAuth) {
        toast({ title: "Error", description: "Authentication is not configured.", variant: "destructive" });
        return;
    }
    try {
      await signInWithEmailAndPassword(firebaseAuth, email, pass);
      router.push('/events');
    } catch (error: any) {
      console.error(error);
      toast({ title: "Login Failed", description: error.message, variant: "destructive" });
    }
  };

  const signUpWithEmail = async (email: string, pass: string) => {
    if (!firebaseAuth) {
      toast({ title: "Error", description: "Authentication is not configured.", variant: "destructive" });
      return;
    }
    try {
      await createUserWithEmailAndPassword(firebaseAuth, email, pass);
      router.push('/events');
    } catch (error: any) {
      console.error(error);
      toast({ title: "Sign Up Failed", description: error.message, variant: "destructive" });
    }
  };

  const signOut = async () => {
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
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithEmail, signUpWithEmail, signOut, isFirebaseReady: isFirebaseEnabled }}>
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
