"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { RefreshCcw, Upload, Eye, X } from 'lucide-react';

interface PhotoPreviewProps {
  image: string;
  onReset: () => void;
  onUploadNew: () => void;
}

export default function PhotoPreview({ image, onReset, onUploadNew }: PhotoPreviewProps) {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  return (
    <div className="space-y-4">
      {/* Cool Header */}
      <div className="flex items-center gap-2">
        <div className="w-2 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
        <h3 className="font-semibold text-base bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Your Photo
        </h3>
        <div className="flex-1 h-px bg-gradient-to-r from-blue-200 to-purple-200"></div>
      </div>
      
      <div className="flex gap-4 items-center p-4 bg-gradient-to-r from-blue-50/50 via-purple-50/30 to-pink-50/50 rounded-xl border border-gradient-to-r from-blue-200/50 to-purple-200/50">
        {/* Photo Thumbnail with Cool Frame */}
        <div className="flex-shrink-0 relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-xl blur-sm opacity-30"></div>
          <div className="relative bg-white p-1 rounded-lg">
            <Image
              src={image}
              alt="Your uploaded photo"
              width={80}
              height={80}
              className="rounded-lg object-cover w-20 h-20"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex-1 space-y-3">
          <div className="flex gap-3">
            <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex-1 bg-white/70 hover:bg-white hover:shadow-md transition-all">
                  <Eye className="h-3 w-3 mr-2" />
                  View Photo
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh]">
                <DialogHeader>
                  <DialogTitle className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Your Photo
                  </DialogTitle>
                </DialogHeader>
                <div className="flex items-center justify-center p-4">
                  <Image
                    src={image}
                    alt="Your uploaded photo - full view"
                    width={800}
                    height={600}
                    className="rounded-lg object-contain max-w-full max-h-[70vh] shadow-lg"
                  />
                </div>
                <div className="flex justify-center gap-3 pb-4">
                  <Button onClick={onUploadNew} variant="outline" className="bg-white/80 hover:bg-white">
                    <Upload className="h-4 w-4 mr-2" />
                    Change Photo
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Button variant="outline" size="sm" onClick={onUploadNew} className="flex-1 bg-white/70 hover:bg-white hover:shadow-md transition-all">
              <Upload className="h-3 w-3 mr-2" />
              Change
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
