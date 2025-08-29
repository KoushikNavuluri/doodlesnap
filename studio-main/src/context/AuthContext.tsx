"use client";

import { createContext, useContext, ReactNode, useCallback, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { GoogleAuthProvider, signInWithPopup, signOut, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null | undefined;
  loading: boolean;
  error: Error | undefined;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, loading, error] = useAuthState(auth);
  const { toast } = useToast();
  const router = useRouter();



  // Show signed-in notification when user is already authenticated
  useEffect(() => {
    if (!loading && user && window.location.pathname === '/login') {
      toast({
        title: "Already signed in!",
        description: `Welcome back, ${user.displayName || 'User'}! Redirecting to editor...`,
      });
      router.replace('/');
    }
  }, [user, loading, router, toast]);

  const signInWithGoogle = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    // Configure provider for better reliability
    provider.addScope('profile');
    provider.addScope('email');
    provider.setCustomParameters({
      prompt: 'select_account'
    });

    try {
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        toast({
          title: "Signed in successfully!",
          description: `Welcome ${result.user.displayName || 'User'}! Let's get doodling.`,
        });
        // Use replace to avoid back button issues
        router.replace('/');
      }
    } catch (error: any) {
      // Handle specific authentication errors
      if (error.code === 'auth/popup-closed-by-user') {
        // User closed the popup, don't show error
        return;
      } else if (error.code === 'auth/popup-blocked') {
        toast({
          title: "Popup blocked",
          description: "Please allow popups for this site and try again.",
          variant: "destructive",
        });
      } else if (error.code === 'auth/cancelled-popup-request') {
        // Multiple popup requests, ignore
        return;
      } else if (error.code === 'auth/network-request-failed') {
        toast({
          title: "Network error",
          description: "Please check your internet connection and try again.",
          variant: "destructive",
        });
      } else {
        console.error("Error signing in with Google: ", error);
        toast({
          title: "Sign in failed",
          description: error.message || "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      }
    }
  }, [router, toast]);



  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
      router.push('/login');
    } catch (error) {
      console.error("Error signing out: ", error);
       toast({
          title: "Sign out failed",
          description: (error as Error).message,
          variant: "destructive",
        });
    }
  }, [router, toast]);

  const value = { user, loading, error, signInWithGoogle, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
