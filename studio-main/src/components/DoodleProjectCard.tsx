"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import ImageModal from '@/components/ImageModal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Download, Calendar, Palette, Image as ImageIcon } from 'lucide-react';

interface DoodleProject {
  original: {
    fileName: string;
    url: string;
    metadata: any;
  };
  doodle: {
    fileName: string;
    url: string;
    metadata: any;
  };
}

interface DoodleProjectCardProps {
  project: DoodleProject;
}

export default function DoodleProjectCard({ project }: DoodleProjectCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showOriginalModal, setShowOriginalModal] = useState(false);
  const [showDoodleModal, setShowDoodleModal] = useState(false);

  const handleDownload = (imageUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-0">
        {/* Main Doodle Image */}
        <div 
          className="relative aspect-square cursor-pointer group"
          onClick={() => setShowDoodleModal(true)}
        >
          <Image
            src={project.doodle.url}
            alt="Generated doodle"
            fill
            className="object-cover transition-transform group-hover:scale-105"
            onLoad={() => setImageLoaded(true)}
          />
          
          {/* Hover overlay for main image */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-colors flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/20 backdrop-blur-sm rounded-full p-3">
              <Eye className="w-6 h-6 text-white" />
            </div>
          </div>
          
          {/* Original Image Preview Overlay */}
          <div className="absolute top-3 left-3">
            <div 
              className="relative w-16 h-16 rounded-lg overflow-hidden border-2 border-white shadow-lg cursor-pointer hover:scale-105 transition-transform"
              onClick={(e) => {
                e.stopPropagation();
                setShowOriginalModal(true);
              }}
            >
              <Image
                src={project.original.url}
                alt="Original image"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-colors flex items-center justify-center">
                <Eye className="w-4 h-4 text-white opacity-0 hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>

          {/* Template Badge */}
          {project.doodle.metadata.templateUsed && (
            <div className="absolute top-3 right-3">
              <Badge variant="secondary" className="bg-white/90 text-gray-800">
                <Palette className="w-3 h-3 mr-1" />
                {project.doodle.metadata.templateUsed}
              </Badge>
            </div>
          )}

          {/* Action Buttons Overlay - Always Visible */}
          <div className="absolute bottom-3 right-3 flex gap-2">
            <Button 
              size="sm" 
              variant="secondary" 
              className="bg-white/95 hover:bg-white shadow-md"
              onClick={(e) => {
                e.stopPropagation();
                setShowDoodleModal(true);
              }}
            >
              <Eye className="w-4 h-4" />
            </Button>
            
            <Button 
              size="sm" 
              variant="secondary" 
              className="bg-white/95 hover:bg-white shadow-md"
              onClick={(e) => {
                e.stopPropagation();
                handleDownload(project.doodle.url, project.doodle.fileName.split('/').pop() || 'doodle.png');
              }}
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Project Info */}
        <div className="p-4 space-y-3">
          {/* Project Title */}
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-base">
              {project.doodle.metadata.templateUsed ? `${project.doodle.metadata.templateUsed} Style` : 'Custom Doodle'}
            </h3>
            <Badge variant="outline" className="text-xs">
              <ImageIcon className="w-3 h-3 mr-1" />
              Doodle Snap
            </Badge>
          </div>

          {/* Creation Date */}
          {project.doodle.metadata.uploadedAt && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="w-4 h-4 mr-2" />
              {formatDate(project.doodle.metadata.uploadedAt)}
            </div>
          )}

          {/* Style Prompt */}
          {project.doodle.metadata.stylePrompt && (
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">Style:</span>{' '}
              <span className="italic">
                {project.doodle.metadata.stylePrompt.length > 60
                  ? `${project.doodle.metadata.stylePrompt.substring(0, 60)}...`
                  : project.doodle.metadata.stylePrompt
                }
              </span>
            </div>
          )}


        </div>
      </CardContent>

      {/* Modals */}
      <ImageModal
        isOpen={showOriginalModal}
        onClose={() => setShowOriginalModal(false)}
        imageUrl={project.original.url}
        title="Original Image"
      />

      <ImageModal
        isOpen={showDoodleModal}
        onClose={() => setShowDoodleModal(false)}
        imageUrl={project.doodle.url}
        title={`${project.doodle.metadata.templateUsed ? `${project.doodle.metadata.templateUsed} Style` : 'Custom'} Doodle Snap`}
        onDownload={() => handleDownload(project.doodle.url, project.doodle.fileName.split('/').pop() || 'doodle.png')}
      />
    </Card>
  );
}
