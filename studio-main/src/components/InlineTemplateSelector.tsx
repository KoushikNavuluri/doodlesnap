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
        <div className="flex gap-4 min-w-max px-1">
          {displayTemplates.map((template, index) => (
            <Card 
              key={template.id}
              className={`group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 flex-shrink-0 w-24 h-24 sm:w-28 sm:h-28 relative overflow-hidden ${
                selectedTemplate?.id === template.id || 
                (selectedTemplate === null && template.id === 'custom')
                  ? 'ring-2 ring-primary shadow-lg scale-105' 
                  : 'hover:ring-1 hover:ring-primary/50'
              }`}
              onClick={() => handleTemplateSelect(template)}
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity ${
                template.category === 'Travel' ? 'bg-gradient-to-br from-blue-400 to-cyan-400' :
                template.category === 'Personal' ? 'bg-gradient-to-br from-pink-400 to-rose-400' :
                template.category === 'Business' ? 'bg-gradient-to-br from-slate-400 to-gray-400' :
                template.category === 'Memory' ? 'bg-gradient-to-br from-amber-400 to-orange-400' :
                template.category === 'Adventure' ? 'bg-gradient-to-br from-green-400 to-emerald-400' :
                template.category === 'Food' ? 'bg-gradient-to-br from-red-400 to-pink-400' :
                template.category === 'Science' ? 'bg-gradient-to-br from-purple-400 to-violet-400' :
                template.category === 'Urban' ? 'bg-gradient-to-br from-gray-400 to-slate-400' :
                template.category === 'Self-Development' ? 'bg-gradient-to-br from-teal-400 to-cyan-400' :
                template.category === 'Sports' ? 'bg-gradient-to-br from-orange-400 to-red-400' :
                template.category === 'Nature' ? 'bg-gradient-to-br from-green-400 to-lime-400' :
                template.category === 'Music' ? 'bg-gradient-to-br from-purple-400 to-pink-400' :
                template.category === 'Culture' ? 'bg-gradient-to-br from-yellow-400 to-amber-400' :
                'bg-gradient-to-br from-indigo-400 to-purple-400'
              }`} />
              
              <CardContent className="p-2 h-full flex flex-col items-center justify-center text-center relative z-10">
                {/* Remove Button */}
                {template.id !== 'custom' && index < favoriteTemplates.length && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-1 right-1 h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFromFavorites(template);
                    }}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                )}

                {/* Icon */}
                <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">
                  {template.icon}
                </div>

                {/* Title */}
                <h4 className="font-semibold text-xs leading-tight text-center line-clamp-2">
                  {template.name}
                </h4>

                {/* Category Badge - Only on larger screens */}
                {template.category !== 'Custom' && (
                  <Badge 
                    variant="secondary" 
                    className="text-xs mt-1 opacity-80 group-hover:opacity-100 transition-opacity hidden sm:inline-flex"
                  >
                    {template.category}
                  </Badge>
                )}

                {/* Selected Indicator */}
                {(selectedTemplate?.id === template.id || 
                  (selectedTemplate === null && template.id === 'custom')) && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-white" />
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Selected Template Info */}
      {selectedTemplate && (
        <div className="p-3 bg-gradient-to-r from-muted/50 to-muted/80 rounded-lg border border-muted">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{selectedTemplate.icon}</span>
            <h4 className="font-medium text-sm">{selectedTemplate.name}</h4>
            <Badge variant="secondary" className="text-xs">{selectedTemplate.category}</Badge>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {selectedTemplate.description}
          </p>
        </div>
      )}
    </div>
  );
}
