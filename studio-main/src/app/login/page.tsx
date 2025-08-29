"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { Chrome } from 'lucide-react';

export default function LoginPage() {
  const { user, signInWithGoogle, loading: authLoading } = useAuth();
  const router = useRouter();
  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    // If user is already authenticated, redirect immediately
    if (!authLoading && user) {
      router.replace('/');
    }
  }, [user, authLoading, router]);

  const handleSignIn = async () => {
    setIsSigningIn(true);
    try {
      await signInWithGoogle();
    } finally {
      setIsSigningIn(false);
    }
  }



  const isLoading = authLoading || isSigningIn;

  // Show loading while checking authentication state
  if (authLoading) {
    return (
       <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated, show loading while redirecting
  if (user) {
    return (
       <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Already signed in! Redirecting to editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-2xl">Welcome to DoodleSnap</CardTitle>
          <CardDescription>Sign in to start creating your doodles.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleSignIn}
            className="w-full"
            disabled={isLoading}
          >
            <Chrome className="mr-2 h-4 w-4" />
            {isLoading ? 'Signing In...' : 'Sign in with Google'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
