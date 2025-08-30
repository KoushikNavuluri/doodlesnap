"use client";

import { Sparkles } from 'lucide-react';

export default function PagePreloader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <div className="relative">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        <Sparkles className="absolute inset-0 h-8 w-8 text-purple-500 animate-pulse" />
      </div>
      <p className="text-muted-foreground animate-pulse">Loading your Doodle Snaps...</p>
    </div>
  );
}
