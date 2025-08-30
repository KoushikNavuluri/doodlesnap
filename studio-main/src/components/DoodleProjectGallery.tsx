"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSimpleImageUpload } from '@/hooks/useSimpleImageUpload';
import DoodleProjectCard from '@/components/DoodleProjectCard';
import PagePreloader from '@/components/PagePreloader';
import { RefreshCw, Sparkles, ImageIcon, Wand2, Zap, Heart, Star, Camera, Palette, ArrowRight } from 'lucide-react';

export default function DoodleProjectGallery() {
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const { getUserDoodleProjects, user } = useSimpleImageUpload();

  const loadProjects = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    
    if (!hasLoadedOnce) {
      setIsLoading(true);
    }
    
    try {
      const userProjects = await getUserDoodleProjects();
      if (userProjects) {
        setProjects(userProjects);
      }
      setHasLoadedOnce(true);
    } catch (error) {
      console.error('Error loading Doodle Snaps:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user !== undefined) { // Only run when user state is determined
      loadProjects();
    }
  }, [user]); // Dependency on user only

  if (!user) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            My Doodle Snaps
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Please log in to view your Doodle Snaps.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-500" />
          My Doodle Snaps ({projects.length})
        </CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={loadProjects}
          disabled={isLoading}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <PagePreloader />
        ) : projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center max-w-2xl mx-auto">
            {/* Animated Icon Hero */}
            <div className="relative mb-8 animate-bounce">
              <div className="relative">
                <Camera className="h-20 w-20 text-gray-300" />
                <Wand2 className="h-10 w-10 text-purple-500 absolute -top-2 -right-2 animate-pulse" />
                <Sparkles className="h-6 w-6 text-yellow-500 absolute -bottom-1 -left-1 animate-ping" />
                <Zap className="h-6 w-6 text-blue-500 absolute top-0 left-0 animate-pulse delay-300" />
              </div>
            </div>

            {/* Fun Heading */}
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
                <Heart className="h-6 w-6 text-red-500" />
                Your Doodle Adventure Awaits!
                <Star className="h-6 w-6 text-yellow-500" />
              </h3>
              <p className="text-lg text-purple-600 font-medium">
                No Doodle Snaps yet, but that's about to change! 🎨
              </p>
            </div>

            {/* Fun Steps */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 w-full">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-2xl border-2 border-dashed border-blue-200 hover:border-blue-400 transition-colors">
                <Camera className="h-8 w-8 text-blue-500 mx-auto mb-3" />
                <h4 className="font-bold text-blue-700 mb-2">1. Snap or Upload</h4>
                <p className="text-sm text-blue-600">
                  Got a cool photo? Upload it and watch the magic begin! 📸
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border-2 border-dashed border-purple-200 hover:border-purple-400 transition-colors">
                <Palette className="h-8 w-8 text-purple-500 mx-auto mb-3" />
                <h4 className="font-bold text-purple-700 mb-2">2. Pick Your Style</h4>
                <p className="text-sm text-purple-600">
                  Cartoon? Sketch? Watercolor? The choice is yours! 🎨
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-teal-50 p-6 rounded-2xl border-2 border-dashed border-green-200 hover:border-green-400 transition-colors">
                <Wand2 className="h-8 w-8 text-green-500 mx-auto mb-3" />
                <h4 className="font-bold text-green-700 mb-2">3. AI Magic!</h4>
                <p className="text-sm text-green-600">
                  Sit back and let our AI turn your photo into art! ✨
                </p>
              </div>
            </div>

            {/* Fun Facts */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-2xl border border-yellow-200 mb-8 w-full">
              <div className="flex items-center justify-center gap-3 mb-3">
                <Zap className="h-5 w-5 text-orange-500" />
                <span className="font-bold text-orange-700">Fun Fact</span>
                <Zap className="h-5 w-5 text-orange-500" />
              </div>
              <p className="text-orange-700 text-sm">
                Our AI has already created <span className="font-bold">millions</span> of doodles! 
                Some users say it's more fun than bubble wrap! 🎪
              </p>
            </div>

            {/* Call to Action */}
            <div className="space-y-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                onClick={() => window.location.href = '/'}
              >
                <Sparkles className="mr-2 h-5 w-5 animate-spin" />
                Start Creating Magic
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <p className="text-xs text-gray-500 max-w-md">
                💡 Pro tip: Try uploading a selfie first - everyone loves their doodled self! 
                Your creations will appear here once complete.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="text-sm text-muted-foreground mb-6 p-4 bg-purple-50 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span className="font-medium text-purple-800">About Your Doodle Snaps</span>
              </div>
              <p className="text-purple-700">
                Each card shows a completed doodle project with your original photo (small preview) 
                and the Doodle Snap : ). Click on images to view them in full size.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, index) => (
                <DoodleProjectCard 
                  key={`${project.doodle.fileName}-${index}`} 
                  project={project} 
                />
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
