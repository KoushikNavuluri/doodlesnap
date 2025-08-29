"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function MyDoodlesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-1 flex flex-col items-center p-8">
          <div className="w-full max-w-4xl">
            <Skeleton className="h-8 w-1/4 mb-4" />
            <Skeleton className="h-4 w-1/2 mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Skeleton className="w-full h-64 rounded-lg" />
              <Skeleton className="w-full h-64 rounded-lg" />
              <Skeleton className="w-full h-64 rounded-lg" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 flex flex-col items-center p-4 md:p-8">
        <div className="w-full max-w-5xl">
            <CardHeader>
                <CardTitle className="font-headline text-3xl">My Doodles</CardTitle>
                <CardDescription>View and manage all your generated doodles.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="text-center text-muted-foreground py-16">
                    <p>You haven't created any doodles yet.</p>
                    <p>Go back to the homepage to start doodling!</p>
                </div>
            </CardContent>
        </div>
      </main>
    </div>
  );
}
