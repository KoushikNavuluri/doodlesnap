"use client";

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Upload, FileImage } from 'lucide-react';
import { useSimpleImageUpload } from '@/hooks/useSimpleImageUpload';
import Image from 'next/image';

export default function ImageUploadTest() {
  const [uploadedImage, setUploadedImage] = useState<{ fileName: string; imageUrl: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadImage, isUploading, uploadProgress, user } = useSimpleImageUpload();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const result = await uploadImage(file, { isOriginal: true });
      if (result) {
        setUploadedImage(result);
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  if (!user) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Image Upload Test</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Please log in to test image uploads.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Image Upload Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!uploadedImage ? (
          <div 
            className="border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-accent transition-colors"
            onClick={handleUploadClick}
            onKeyDown={(e) => e.key === 'Enter' && handleUploadClick()}
            role="button"
            tabIndex={0}
          >
            <FileImage className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">Click to upload your image</p>
            <p className="text-xs text-muted-foreground mt-1">PNG, JPG, WEBP up to 10MB</p>
          </div>
        ) : (
          <div className="space-y-4">
            <Image
              src={uploadedImage.imageUrl}
              alt="Uploaded test image"
              width={400}
              height={300}
              className="rounded-lg object-cover w-full h-48"
            />
            <div className="text-sm text-muted-foreground">
              <p><strong>File Name:</strong> {uploadedImage.fileName}</p>
              <p><strong>URL:</strong> {uploadedImage.imageUrl}</p>
            </div>
            <Button variant="outline" onClick={handleUploadClick} className="w-full">
              <Upload className="mr-2 h-4 w-4" />
              Upload Another Image
            </Button>
          </div>
        )}

        {isUploading && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Uploading...</p>
            <Progress value={uploadProgress} className="w-full" />
          </div>
        )}

        <Input 
          ref={fileInputRef}
          type="file" 
          className="hidden" 
          accept="image/*" 
          onChange={handleFileChange} 
          disabled={isUploading}
        />
      </CardContent>
    </Card>
  );
}
