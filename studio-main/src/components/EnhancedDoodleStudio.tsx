"use client";

import { useState, useRef, type ChangeEvent } from 'react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Upload, Download, Sparkles, RefreshCcw, FileImage, Palette, Edit3 } from 'lucide-react';
import { generateDoodle } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';

import { Skeleton } from '@/components/ui/skeleton';
import DoodleLoadingAnimation from '@/components/DoodleLoadingAnimation';
import TemplateGallery from '@/components/TemplateGallery';
import TemplateEditor from '@/components/TemplateEditor';
import { DoodleTemplate } from '@/types/templates';

type ViewMode = 'gallery' | 'template-editor' | 'custom-editor';

export default function EnhancedDoodleStudio() {
  const [viewMode, setViewMode] = useState<ViewMode>('gallery');
  const [selectedTemplate, setSelectedTemplate] = useState<DoodleTemplate | null>(null);
  
  // Original custom editor state
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [doodledImage, setDoodledImage] = useState<string | null>(null);
  const [stylePrompt, setStylePrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleTemplateSelect = (template: DoodleTemplate) => {
    setSelectedTemplate(template);
    setViewMode('template-editor');
  };

  const handleBackToGallery = () => {
    setViewMode('gallery');
    setSelectedTemplate(null);
  };

  const handleSwitchToCustom = () => {
    setViewMode('custom-editor');
  };

  // Original custom editor functions
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File Type",
          description: "Please upload an image file (e.g., JPEG, PNG, WEBP).",
          variant: "destructive",
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setOriginalImage(reader.result as string);
        setDoodledImage(null);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleGenerateDoodle = async () => {
    if (!originalImage) return;

    setIsLoading(true);
    setDoodledImage(null);
    
    try {
      const result = await generateDoodle({
        photoDataUri: originalImage,
        stylePrompt: stylePrompt,
      });

      if (result.doodledImage) {
        setDoodledImage(result.doodledImage);
        toast({
          title: "Doodle created!",
          description: "Your image has been successfully transformed into a doodle.",
        });
      } else {
        toast({
          title: "Doodle Generation Failed",
          description: result.error || "An unknown error occurred.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Doodle Generation Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDownload = () => {
    if (!doodledImage) return;
    const link = document.createElement('a');
    link.href = doodledImage;
    link.download = 'doodlesnap.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleReset = () => {
    setOriginalImage(null);
    setDoodledImage(null);
    setStylePrompt('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const renderCustomEditor = () => (
    <div className="w-full max-w-6xl">
      {/* Navigation */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-headline text-2xl font-bold">Custom Doodle Editor</h2>
        <Button variant="outline" onClick={() => setViewMode('gallery')}>
          <Palette className="mr-2 h-4 w-4" />
          Browse Templates
        </Button>
      </div>

      {!originalImage ? (
        <Card className="w-full max-w-lg mx-auto text-center animate-in fade-in-50">
          <CardHeader>
            <CardTitle className="font-headline text-3xl">Upload Your Image</CardTitle>
            <CardDescription>Let's turn your photo into a doodle masterpiece.</CardDescription>
          </CardHeader>
          <CardContent>
            <div 
              className="border-2 border-dashed border-border rounded-lg p-12 flex flex-col items-center justify-center cursor-pointer hover:bg-accent transition-colors"
              onClick={handleUploadClick}
              onKeyDown={(e) => e.key === 'Enter' && handleUploadClick()}
              role="button"
              tabIndex={0}
            >
              <FileImage className="w-16 h-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Click to browse or drag and drop</p>
              <p className="text-xs text-muted-foreground mt-1">PNG, JPG, WEBP up to 10MB</p>
              <Input 
                ref={fileInputRef}
                type="file" 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange} 
              />
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start animate-in fade-in-50">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="font-headline text-2xl">Your Photo</CardTitle>
                <Button variant="ghost" size="sm" onClick={handleReset}>
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  Start Over
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {originalImage && (
                <Image
                  src={originalImage}
                  alt="Original user upload"
                  width={600}
                  height={600}
                  className="rounded-lg object-contain w-full h-auto"
                  data-ai-hint="user upload"
                />
              )}
            </CardContent>
          </Card>
          
          <div className="flex flex-col gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-2xl">Customize Your Doodle</CardTitle>
                <CardDescription>Add a prompt to guide the AI's style.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="style-prompt">Style Prompt (optional)</Label>
                    <Input
                      id="style-prompt"
                      placeholder="e.g., 'minimalist lines', 'add cute stars'"
                      value={stylePrompt}
                      onChange={(e) => setStylePrompt(e.target.value)}
                      disabled={isLoading}
                      className="mt-2"
                    />
                  </div>
                  <Button onClick={handleGenerateDoodle} disabled={isLoading}>
                    <Sparkles className="mr-2 h-4 w-4"/>
                    {isLoading ? 'Doodling...' : 'Doodlefy!'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="font-headline text-2xl">Your Doodled Snap ✨</CardTitle>
                  {doodledImage && !isLoading && (
                    <Button onClick={handleDownload} variant="secondary">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex items-center justify-center min-h-[300px]">
                {isLoading && (
                  <div className="w-full flex items-center justify-center">
                    <DoodleLoadingAnimation />
                  </div>
                )}
                {!isLoading && doodledImage && (
                  <Image
                    src={doodledImage}
                    alt="AI generated doodled image"
                    width={600}
                    height={600}
                    className="rounded-lg object-contain w-full h-auto"
                    data-ai-hint="doodled image"
                  />
                )}
                {!isLoading && !doodledImage && (
                  <div className="w-full aspect-square border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center text-center p-8">
                    <Sparkles className="w-16 h-16 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Your doodle masterpiece will appear here.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full flex justify-center p-4">
      {viewMode === 'gallery' && (
        <div className="w-full space-y-6">
          <div className="flex justify-center">
            <Button variant="outline" onClick={handleSwitchToCustom} className="mb-6">
              <Edit3 className="mr-2 h-4 w-4" />
              Custom Editor
            </Button>
          </div>
          <TemplateGallery onSelectTemplate={handleTemplateSelect} />
        </div>
      )}
      
      {viewMode === 'template-editor' && selectedTemplate && (
        <TemplateEditor template={selectedTemplate} onBack={handleBackToGallery} />
      )}
      
      {viewMode === 'custom-editor' && renderCustomEditor()}
    </div>
  );
}
