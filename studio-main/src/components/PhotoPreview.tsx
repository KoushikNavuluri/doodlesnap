"use client";

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { RefreshCcw, Upload } from 'lucide-react';

interface PhotoPreviewProps {
  image: string;
  onReset: () => void;
  onUploadNew: () => void;
}

export default function PhotoPreview({ image, onReset, onUploadNew }: PhotoPreviewProps) {
  return (
    <div className="space-y-3">
      <h3 className="font-medium text-sm">Your Photo</h3>
      <div className="relative group">
        <Image
          src={image}
          alt="Your uploaded photo"
          width={200}
          height={150}
          className="rounded-lg object-cover w-full h-32 border"
        />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={onUploadNew}>
              <Upload className="h-3 w-3 mr-1" />
              Change
            </Button>
            <Button variant="secondary" size="sm" onClick={onReset}>
              <RefreshCcw className="h-3 w-3 mr-1" />
              Reset
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
