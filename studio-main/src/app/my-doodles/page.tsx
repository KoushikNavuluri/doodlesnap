"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import DoodleProjectGallery from '@/components/DoodleProjectGallery';

export default function MyDoodlesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 flex flex-col items-center p-4 md:p-8">
        <div className="w-full max-w-7xl space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">My Doodle Snaps</h1>
            <p className="text-muted-foreground mt-2">
              View and manage all your completed Doodle Snaps. Each project shows your original photo and AI-generated doodle together.
            </p>
          </div>
          <DoodleProjectGallery />
        </div>
      </main>
    </div>
  );
}
