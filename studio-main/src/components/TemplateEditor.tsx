"use client";

import { useState, useRef, type ChangeEvent } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Upload, Sparkles, FileImage, Download } from 'lucide-react';
import { DoodleTemplate, FilledTemplate } from '@/types/templates';
import { useToast } from '@/hooks/use-toast';
import { generateDoodle } from '@/app/actions';
import DoodleLoadingAnimation from './DoodleLoadingAnimation';

interface TemplateEditorProps {
  template: DoodleTemplate;
  onBack: () => void;
}

export default function TemplateEditor({ template, onBack }: TemplateEditorProps) {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [doodledImage, setDoodledImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedColorPalette, setSelectedColorPalette] = useState(template.colorPalettes[0]);
  const [parameters, setParameters] = useState<Record<string, string>>(() => {
    const defaultParams: Record<string, string> = {};
    template.parameters.forEach(param => {
      defaultParams[param.key] = param.defaultValue || '';
    });
    return defaultParams;
  });

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

  const handleParameterChange = (key: string, value: string) => {
    setParameters(prev => ({ ...prev, [key]: value }));
  };

  const buildPrompt = () => {
    let prompt = template.prompt;
    
    // Replace parameters
    Object.entries(parameters).forEach(([key, value]) => {
      prompt = prompt.replace(new RegExp(`{${key}}`, 'g'), value || `[${key}]`);
    });
    
    // Replace color palette
    prompt = prompt.replace(/{color_palette}/g, selectedColorPalette);
    
    return prompt;
  };

  const handleGenerateDoodle = async () => {
    if (!originalImage) return;

    // Validate required parameters
    const missingParams = template.parameters
      .filter(param => param.required && !parameters[param.key])
      .map(param => param.label);

    if (missingParams.length > 0) {
      toast({
        title: "Missing Required Fields",
        description: `Please fill in: ${missingParams.join(', ')}`,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setDoodledImage(null);

    try {
      const customPrompt = buildPrompt();
      const result = await generateDoodle({
        photoDataUri: originalImage,
        stylePrompt: customPrompt,
      });

      if (result.doodledImage) {
        setDoodledImage(result.doodledImage);
        toast({
          title: "Doodle created!",
          description: `Your ${template.name} has been successfully created.`,
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
    link.download = `doodlesnap-${template.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Gallery
        </Button>
        <div className="flex items-center gap-3">
          <span className="text-2xl">{template.icon}</span>
          <div>
            <h1 className="font-headline text-2xl font-bold">{template.name}</h1>
            <p className="text-muted-foreground">{template.description}</p>
          </div>
        </div>
        <Badge variant="secondary">{template.category}</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side - Configuration */}
        <div className="space-y-6">
          {/* Image Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Upload Your Image</CardTitle>
              <CardDescription>Select the photo you want to transform</CardDescription>
            </CardHeader>
            <CardContent>
              {!originalImage ? (
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
                    src={originalImage}
                    alt="Uploaded image"
                    width={400}
                    height={300}
                    className="rounded-lg object-cover w-full h-48"
                  />
                  <Button variant="outline" onClick={handleUploadClick} className="w-full">
                    <Upload className="mr-2 h-4 w-4" />
                    Change Image
                  </Button>
                </div>
              )}
              <Input 
                ref={fileInputRef}
                type="file" 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange} 
              />
            </CardContent>
          </Card>

          {/* Parameters */}
          {template.parameters.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Customize Your Doodle</CardTitle>
                <CardDescription>Personalize the template with your details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {template.parameters.map(param => (
                  <div key={param.key} className="space-y-2">
                    <Label htmlFor={param.key}>
                      {param.label}
                      {param.required && <span className="text-red-500 ml-1">*</span>}
                    </Label>
                    {param.type === 'select' ? (
                      <Select 
                        value={parameters[param.key]} 
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
                        value={parameters[param.key]}
                        onChange={(e) => handleParameterChange(param.key, e.target.value)}
                      />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Color Palette */}
          <Card>
            <CardHeader>
              <CardTitle>Color Style</CardTitle>
              <CardDescription>Choose the color palette for your doodles</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedColorPalette} onValueChange={setSelectedColorPalette}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {template.colorPalettes.map(palette => (
                    <SelectItem key={palette} value={palette}>
                      <span className="capitalize">{palette}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Generate Button */}
          <Button 
            onClick={handleGenerateDoodle} 
            disabled={!originalImage || isLoading}
            className="w-full"
            size="lg"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            {isLoading ? 'Creating Doodle...' : 'Generate Doodle'}
          </Button>
        </div>

        {/* Right Side - Preview */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Your Doodled Snap ✨</CardTitle>
                {doodledImage && !isLoading && (
                  <Button onClick={handleDownload} variant="secondary">
                    <Download className="mr-2 h-4 w-4" />
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
                  alt="Generated doodle"
                  width={600}
                  height={400}
                  className="rounded-lg object-contain w-full h-auto max-h-96"
                />
              )}
              {!isLoading && !doodledImage && (
                <div className="w-full aspect-square border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center text-center p-8">
                  <Sparkles className="w-16 h-16 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    {originalImage 
                      ? 'Click "Generate Doodle" to see your creation here'
                      : 'Upload an image and configure your doodle settings to get started'
                    }
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
