import { useState, useCallback, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';

interface UploadResponse {
  success: boolean;
  imageUrl?: string;
  fileName?: string;
  fileSize?: number;
  contentType?: string;
  error?: string;
}

interface UploadOptions {
  isOriginal?: boolean;
  parentImageId?: string;
  stylePrompt?: string;
  templateUsed?: string;
}

interface UseSimpleImageUploadReturn {
  uploadImage: (file: File, options?: UploadOptions) => Promise<{ fileName: string; imageUrl: string } | null>;
  getUserImages: () => Promise<any[] | null>;
  getUserDoodleProjects: () => Promise<any[] | null>;
  isUploading: boolean;
  uploadProgress: number;
  user: any;
}

export function useSimpleImageUpload(): UseSimpleImageUploadReturn {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [user, loading] = useAuthState(auth);
  const { toast } = useToast();

  const uploadImage = async (file: File, options: UploadOptions = {}): Promise<{ fileName: string; imageUrl: string } | null> => {
    if (!file) {
      toast({
        title: "No File Selected",
        description: "Please select an image file to upload.",
        variant: "destructive",
      });
      return null;
    }

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to upload images.",
        variant: "destructive",
      });
      return null;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File Type",
        description: "Please upload an image file (e.g., JPEG, PNG, WEBP).",
        variant: "destructive",
      });
      return null;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      toast({
        title: "File Too Large",
        description: "Image size must be less than 10MB.",
        variant: "destructive",
      });
      return null;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('userId', user.uid);
      formData.append('isOriginal', (options.isOriginal ?? true).toString());
      
      if (options.parentImageId) {
        formData.append('parentImageId', options.parentImageId);
      }
      if (options.stylePrompt) {
        formData.append('stylePrompt', options.stylePrompt);
      }
      if (options.templateUsed) {
        formData.append('templateUsed', options.templateUsed);
      }

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + 10;
          return newProgress >= 90 ? 90 : newProgress;
        });
      }, 100);

      const response = await fetch('/api/simple-upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      const result: UploadResponse = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Upload failed');
      }

      toast({
        title: "Upload Successful",
        description: "Your image has been uploaded successfully.",
      });

      return {
        fileName: result.fileName!,
        imageUrl: result.imageUrl!,
      };

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to upload image.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const getUserImages = async (): Promise<any[] | null> => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to view your images.",
        variant: "destructive",
      });
      return null;
    }

    try {
      const response = await fetch(`/api/simple-upload?userId=${encodeURIComponent(user.uid)}`);
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to fetch images');
      }

      return result.images;
    } catch (error) {
      console.error('Error fetching images:', error);
      toast({
        title: "Fetch Failed",
        description: error instanceof Error ? error.message : "Failed to fetch images.",
        variant: "destructive",
      });
      return null;
    }
  };

  const getUserDoodleProjects = useCallback(async (): Promise<any[] | null> => {
    if (!user) {
      console.log('getUserDoodleProjects: No user authenticated');
      return null;
    }

    console.log('getUserDoodleProjects: Fetching for user:', user.uid);

    try {
      const url = `/api/simple-upload/projects?userId=${encodeURIComponent(user.uid)}`;
      console.log('getUserDoodleProjects: Making request to:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      
      console.log('getUserDoodleProjects: Response status:', response.status);
      
      const result = await response.json();
      console.log('getUserDoodleProjects: Response data:', result);

      if (!response.ok || !result.success) {
        const errorMessage = result.error || `HTTP ${response.status}: Failed to fetch Doodle Snaps`;
        console.error('getUserDoodleProjects: API error:', errorMessage);
        throw new Error(errorMessage);
      }

      console.log('getUserDoodleProjects: Successfully fetched', result.projects?.length || 0, 'projects');
      return result.projects || [];
    } catch (error) {
      console.error('getUserDoodleProjects: Complete error details:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        userId: user.uid
      });
      
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch Doodle Snaps.";
      
      toast({
        title: "Fetch Failed",
        description: `Error: ${errorMessage}`,
        variant: "destructive",
      });
      
      // Re-throw the error so it can be caught by the calling component
      throw new Error(`Failed to fetch user Doodle Snaps: ${errorMessage}`);
    }
  }, [user, toast]);

  return {
    uploadImage,
    getUserImages,
    getUserDoodleProjects,
    isUploading,
    uploadProgress,
    user,
  };
}
