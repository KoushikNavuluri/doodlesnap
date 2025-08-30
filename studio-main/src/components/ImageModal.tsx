"use client";

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, X } from 'lucide-react';
import Image from 'next/image';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title: string;
  onDownload?: () => void;
}

export default function ImageModal({ isOpen, onClose, imageUrl, title, onDownload }: ImageModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 border-0 bg-black/95 backdrop-blur-sm">
        <DialogTitle className="sr-only">{title}</DialogTitle>
        
        {/* Header with controls */}
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          {onDownload && (
            <Button
              size="sm"
              variant="secondary"
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border-white/20 text-white"
              onClick={onDownload}
            >
              <Download className="w-4 h-4" />
            </Button>
          )}
          <Button
            size="sm"
            variant="secondary"
            className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border-white/20 text-white"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Image container */}
        <div className="relative w-full h-[95vh] flex items-center justify-center p-8">
          <div className="relative max-w-full max-h-full">
            <Image
              src={imageUrl}
              alt={title}
              width={1200}
              height={1200}
              className="max-w-full max-h-full object-contain rounded-lg"
              style={{ 
                maxWidth: '100%', 
                maxHeight: '100%',
                width: 'auto',
                height: 'auto'
              }}
            />
          </div>
        </div>

        {/* Optional title overlay */}
        <div className="absolute bottom-4 left-4 z-10">
          <div className="bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2">
            <p className="text-white text-sm font-medium">{title}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
