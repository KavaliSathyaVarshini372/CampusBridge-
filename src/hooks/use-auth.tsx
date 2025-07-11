
"use client";

import React, { useState, useEffect, useContext, createContext, useCallback } from 'react';
import { User, onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { auth, isFirebaseEnabled } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useToast } from './use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();
  
  useEffect(() => {
    if (!isFirebaseEnabled) {
        console.warn("Firebase Auth is not available. Running in offline mode.");
        setLoading(false);
        return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
        setLoading(false);
        if (user) {
          // Redirect based on role
          if (user.email === 'admin@example.com') {
            // Check if we are not already in an admin path to avoid redirect loops
            if (!window.location.pathname.startsWith('/events')) {
               router.push('/events');
            }
          } else {
            // For regular users, redirect to home if they are on a non-home page
            if (window.location.pathname !== '/') {
               router.push('/');
            }
          }
        }
    });
    return () => unsubscribe();
  }, [router]);

  const signOut = useCallback(async () => {
    if (!isFirebaseEnabled) {
        toast({ title: "Error", description: "Authentication service is not available.", variant: "destructive" });
        return;
    }
    try {
      await firebaseSignOut(auth);
      router.push('/');
      toast({ title: "Signed Out", description: "You have been successfully signed out." });
    } catch (error: any) {
      toast({ title: "Sign Out Failed", description: error.message, variant: "destructive" });
    }
  }, [router, toast]);

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
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
