"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Minus, MoreHorizontal, Palette } from 'lucide-react';
import { DoodleTemplate } from '@/types/templates';
import { DOODLE_TEMPLATES, TEMPLATE_CATEGORIES } from '@/data/templates';
import { useTemplatePreferences } from '@/hooks/useTemplatePreferences';

interface InlineTemplateSelectorProps {
  selectedTemplate: DoodleTemplate | null;
  onSelectTemplate: (template: DoodleTemplate | null) => void;
}

const CUSTOM_TEMPLATE: DoodleTemplate = {
  id: 'custom',
  name: 'Custom Style',
  description: 'Create your own doodle style with a custom prompt',
  category: 'Custom',
  icon: '🎨',
  prompt: '',
  parameters: [],
  colorPalettes: []
};

export default function InlineTemplateSelector({ 
  selectedTemplate, 
  onSelectTemplate 
}: InlineTemplateSelectorProps) {
  const { 
    favoriteTemplates, 
    addToFavorites, 
    removeFromFavorites, 
    isFavorite,
    canAddMore 
  } = useTemplatePreferences();
  
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredAllTemplates = DOODLE_TEMPLATES.filter(template => 
    selectedCategory === 'All' || template.category === selectedCategory
  );

  const displayTemplates = [...favoriteTemplates, CUSTOM_TEMPLATE];

  const handleTemplateSelect = (template: DoodleTemplate) => {
    onSelectTemplate(template.id === 'custom' ? null : template);
    if (template.id !== 'custom') {
      setIsGalleryOpen(false);
    }
  };

  const handleAddToFavorites = (template: DoodleTemplate) => {
    if (canAddMore && !isFavorite(template.id)) {
      addToFavorites(template.id);
    }
  };

  const handleRemoveFromFavorites = (template: DoodleTemplate) => {
    if (template.id !== 'custom') {
      removeFromFavorites(template.id);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Choose Doodle Style</h3>
        <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="mr-2 h-4 w-4" />
              More Templates
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-5xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle>Template Gallery</DialogTitle>
              <DialogDescription>
                Choose templates to add to your favorites (max {9 - favoriteTemplates.length} more)
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                {TEMPLATE_CATEGORIES.slice(0, 8).map(category => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>

              {/* Template Grid */}
              <ScrollArea className="h-96">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pr-4">
                  {filteredAllTemplates.map(template => {
                    const isTemplateFavorite = isFavorite(template.id);
                    return (
                      <Card 
                        key={template.id} 
                        className={`hover:shadow-md transition-shadow ${
                          isTemplateFavorite ? 'ring-2 ring-primary' : ''
                        }`}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{template.icon}</span>
                              <Badge variant="secondary" className="text-xs">
                                {template.category}
                              </Badge>
                            </div>
                            {isTemplateFavorite ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveFromFavorites(template)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                            ) : (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleAddToFavorites(template)}
                                disabled={!canAddMore}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                          <div>
                            <CardTitle className="text-sm">{template.name}</CardTitle>
                            <CardDescription className="text-xs line-clamp-2">
                              {template.description}
                            </CardDescription>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => handleTemplateSelect(template)}
                          >
                            Use Template
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Template Cards - Horizontal Scroll */}
      <div className="overflow-x-auto pb-2">
        <div className="flex gap-3 min-w-max">
          {displayTemplates.map((template, index) => (
                      <Card 
            key={template.id}
            className={`cursor-pointer transition-all hover:shadow-md flex-shrink-0 w-28 sm:w-32 ${
              selectedTemplate?.id === template.id || 
              (selectedTemplate === null && template.id === 'custom')
                ? 'ring-2 ring-primary shadow-md' 
                : ''
            }`}
            onClick={() => handleTemplateSelect(template)}
          >
            <CardContent className="p-2 sm:p-3">
              <div className="flex flex-col items-center text-center space-y-1.5 sm:space-y-2">
                <div className="flex items-center justify-between w-full">
                  <span className="text-base sm:text-lg">{template.icon}</span>
                  {template.id !== 'custom' && index < favoriteTemplates.length && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-5 w-5 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFromFavorites(template);
                      }}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-xs leading-tight">{template.name}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5 hidden sm:block">
                    {template.description}
                  </p>
                </div>
                {template.category !== 'Custom' && (
                  <Badge variant="outline" className="text-xs">
                    {template.category}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
          ))}
        </div>
      </div>

      {/* Selected Template Info */}
      {selectedTemplate && (
        <div className="p-3 bg-muted rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{selectedTemplate.icon}</span>
            <h4 className="font-medium">{selectedTemplate.name}</h4>
            <Badge variant="secondary">{selectedTemplate.category}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {selectedTemplate.description}
          </p>
        </div>
      )}
    </div>
  );
}
