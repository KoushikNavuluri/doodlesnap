"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSimpleImageUpload } from '@/hooks/useSimpleImageUpload';
import Image from 'next/image';
import { RefreshCw, ImageIcon } from 'lucide-react';

export default function UserImageGallery() {
  const [images, setImages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { getUserImages, user } = useSimpleImageUpload();

  const loadImages = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const userImages = await getUserImages();
      if (userImages) {
        setImages(userImages);
      }
    } catch (error) {
      console.error('Error loading images:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadImages();
  }, [user]);

  if (!user) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>My Images</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Please log in to view your images.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>My Images ({images.length})</CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={loadImages}
          disabled={isLoading}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <RefreshCw className="h-6 w-6 animate-spin mr-2" />
            <span>Loading images...</span>
          </div>
        ) : images.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No images uploaded yet.</p>
            <p className="text-sm text-muted-foreground mt-1">
              Upload your first image to get started!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <div key={index} className="space-y-2">
                <div className="relative aspect-square overflow-hidden rounded-lg border">
                  <Image
                    src={image.url}
                    alt={`Image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p><strong>File:</strong> {image.fileName.split('/').pop()}</p>
                  {image.metadata.uploadedAt && (
                    <p><strong>Uploaded:</strong> {new Date(image.metadata.uploadedAt).toLocaleDateString()}</p>
                  )}
                  <p>
                    <strong>Type:</strong> 
                    <span className={`ml-1 px-2 py-1 rounded text-xs font-medium ${
                      image.metadata.isOriginal === 'true' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {image.metadata.isOriginal === 'true' ? 'Original' : 'Doodle'}
                    </span>
                  </p>
                  {image.metadata.parentImageId && (
                    <p><strong>Based on:</strong> {image.metadata.parentImageId.split('/').pop()}</p>
                  )}
                  {image.metadata.templateUsed && (
                    <p><strong>Template:</strong> {image.metadata.templateUsed}</p>
                  )}
                  {image.metadata.stylePrompt && (
                    <p><strong>Style:</strong> {image.metadata.stylePrompt.substring(0, 50)}{image.metadata.stylePrompt.length > 50 ? '...' : ''}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
