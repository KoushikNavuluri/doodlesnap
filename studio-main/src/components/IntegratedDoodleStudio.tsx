"use client";

import { useState, useRef, type ChangeEvent } from 'react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Download, Sparkles, RefreshCcw, FileImage } from 'lucide-react';
import { generateDoodle } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';

import DoodleLoadingAnimation from '@/components/DoodleLoadingAnimation';
import InlineTemplateSelector from '@/components/InlineTemplateSelector';
import PhotoPreview from '@/components/PhotoPreview';
import { DoodleTemplate } from '@/types/templates';

export default function IntegratedDoodleStudio() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [doodledImage, setDoodledImage] = useState<string | null>(null);
  const [stylePrompt, setStylePrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedTemplate, setSelectedTemplate] = useState<DoodleTemplate | null>(null);
  const [templateParameters, setTemplateParameters] = useState<Record<string, string>>({});
  const [selectedColorPalette, setSelectedColorPalette] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

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

  const handleTemplateSelect = (template: DoodleTemplate | null) => {
    setSelectedTemplate(template);
    setTemplateParameters({});
    setSelectedColorPalette('');
    
    if (template) {
      // Initialize parameters with default values
      const defaultParams: Record<string, string> = {};
      template.parameters.forEach(param => {
        defaultParams[param.key] = param.defaultValue || '';
      });
      setTemplateParameters(defaultParams);
      
      // Set first color palette as default
      if (template.colorPalettes.length > 0) {
        setSelectedColorPalette(template.colorPalettes[0]);
      }
    }
  };

  const handleParameterChange = (key: string, value: string) => {
    setTemplateParameters(prev => ({ ...prev, [key]: value }));
  };

  const buildPrompt = () => {
    if (!selectedTemplate) {
      return stylePrompt;
    }

    let prompt = selectedTemplate.prompt;
    
    // Replace parameters
    Object.entries(templateParameters).forEach(([key, value]) => {
      prompt = prompt.replace(new RegExp(`{${key}}`, 'g'), value || `[${key}]`);
    });
    
    // Replace color palette
    if (selectedColorPalette) {
      prompt = prompt.replace(/{color_palette}/g, selectedColorPalette);
    }
    
    return prompt;
  };

  const handleGenerateDoodle = async () => {
    if (!originalImage) return;

    // Validate required parameters for template
    if (selectedTemplate) {
      const missingParams = selectedTemplate.parameters
        .filter(param => param.required && !templateParameters[param.key])
        .map(param => param.label);

      if (missingParams.length > 0) {
        toast({
          title: "Missing Required Fields",
          description: `Please fill in: ${missingParams.join(', ')}`,
          variant: "destructive",
        });
        return;
      }
    }

    setIsLoading(true);
    setDoodledImage(null);
    
    try {
      const finalPrompt = buildPrompt();
      const result = await generateDoodle({
        photoDataUri: originalImage,
        stylePrompt: finalPrompt,
      });

      if (result.doodledImage) {
        setDoodledImage(result.doodledImage);
        toast({
          title: "Doodle created!",
          description: selectedTemplate 
            ? `Your ${selectedTemplate.name} has been successfully created.`
            : "Your custom doodle has been successfully created.",
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
    link.download = selectedTemplate 
      ? `doodlesnap-${selectedTemplate.id}.png` 
      : 'doodlesnap-custom.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleReset = () => {
    setOriginalImage(null);
    setDoodledImage(null);
    setStylePrompt('');
    setSelectedTemplate(null);
    setTemplateParameters({});
    setSelectedColorPalette('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const renderUploadState = () => (
    <Card className="w-full max-w-lg text-center animate-in fade-in-50">
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
  );
  
  const renderEditorState = () => (
    <div className="w-full max-w-7xl animate-in fade-in-50">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Photo & Customization */}
        <div className="lg:col-span-2 space-y-6">
          {/* Photo Preview */}
          <div className="bg-muted/50 rounded-lg p-4">
            <PhotoPreview 
              image={originalImage!}
              onReset={handleReset}
              onUploadNew={handleUploadClick}
            />
          </div>

          {/* Customization Card */}
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl">Customize Your Doodle</CardTitle>
              <CardDescription>Choose a style and customize your doodle.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                    {/* Template Selector */}
                    <InlineTemplateSelector
                      selectedTemplate={selectedTemplate}
                      onSelectTemplate={handleTemplateSelect}
                    />
                    
                    {/* Template Parameters */}
                    {selectedTemplate && selectedTemplate.parameters.length > 0 && (
                      <div className="space-y-4">
                        <h4 className="font-medium">Template Settings</h4>
                        {selectedTemplate.parameters.map(param => (
                          <div key={param.key} className="space-y-2">
                            <Label htmlFor={param.key}>
                              {param.label}
                              {param.required && <span className="text-red-500 ml-1">*</span>}
                            </Label>
                            {param.type === 'select' ? (
                              <Select 
                                value={templateParameters[param.key] || ''} 
                                onValueChange={(value) => handleParameterChange(param.key, value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder={`Select ${param.label.toLowerCase()}`} />
                                </SelectTrigger>
                                <SelectContent>
                                  {param.options?.map(option => (
                                    <SelectItem key={option} value={option}>
                                      {option}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : (
                              <Input
                                id={param.key}
                                type={param.type}
                                placeholder={param.placeholder}
                                value={templateParameters[param.key] || ''}
                                onChange={(e) => handleParameterChange(param.key, e.target.value)}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Color Palette Selection */}
                    {selectedTemplate && selectedTemplate.colorPalettes.length > 0 && (
                      <div className="space-y-2">
                        <Label>Color Style</Label>
                        <Select value={selectedColorPalette} onValueChange={setSelectedColorPalette}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose color style" />
                          </SelectTrigger>
                          <SelectContent>
                            {selectedTemplate.colorPalettes.map(palette => (
                              <SelectItem key={palette} value={palette}>
                                <span className="capitalize">{palette}</span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {/* Custom Style Prompt - Only for custom template */}
                    {!selectedTemplate && (
                      <div className="space-y-2">
                        <Label htmlFor="style-prompt">Style Prompt (optional)</Label>
                        <Input
                          id="style-prompt"
                          placeholder="e.g., 'minimalist lines', 'add cute stars'"
                          value={stylePrompt}
                          onChange={(e) => setStylePrompt(e.target.value)}
                          disabled={isLoading}
                        />
                      </div>
                    )}

                    <Button onClick={handleGenerateDoodle} disabled={isLoading} className="w-full" size="lg">
                        <Sparkles className="mr-2 h-5 w-5"/>
                        {isLoading ? 'Doodling...' : 'Doodlefy!'}
                    </Button>
                </CardContent>
            </Card>
        </div>

        {/* Right Column - Doodle Result */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="font-headline text-xl">Your Doodled Snap ✨</CardTitle>
                {doodledImage && !isLoading && (
                  <Button onClick={handleDownload} variant="secondary" size="sm">
                    <Download className="mr-2 h-3 w-3" />
                    Download
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex items-center justify-center min-h-[400px]">
              {isLoading && (
                <div className="w-full flex items-center justify-center">
                  <DoodleLoadingAnimation />
                </div>
              )}
              {!isLoading && doodledImage && (
                <Image
                  src={doodledImage}
                  alt="AI generated doodled image"
                  width={400}
                  height={400}
                  className="rounded-lg object-contain w-full h-auto"
                  data-ai-hint="doodled image"
                />
              )}
              {!isLoading && !doodledImage && (
                <div className="w-full aspect-square border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center text-center p-6">
                  <Sparkles className="w-12 h-12 text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground">Your doodle masterpiece will appear here.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Hidden File Input */}
      <Input 
        ref={fileInputRef}
        type="file" 
        className="hidden" 
        accept="image/*" 
        onChange={handleFileChange} 
      />
    </div>
  );

  return (
    <div className="w-full flex justify-center px-4">
      {!originalImage ? renderUploadState() : renderEditorState()}
    </div>
  );
}
