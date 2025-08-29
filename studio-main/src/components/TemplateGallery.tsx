"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Sparkles } from 'lucide-react';
import { DOODLE_TEMPLATES, TEMPLATE_CATEGORIES } from '@/data/templates';
import { DoodleTemplate } from '@/types/templates';

interface TemplateGalleryProps {
  onSelectTemplate: (template: DoodleTemplate) => void;
}

export default function TemplateGallery({ onSelectTemplate }: TemplateGalleryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredTemplates = DOODLE_TEMPLATES.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="font-headline text-4xl font-bold">Choose Your Doodle Style</h1>
        <p className="text-muted-foreground text-lg">Select a template to transform your image with personalized doodles</p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {TEMPLATE_CATEGORIES.map(category => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map(template => (
          <Card key={template.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-2xl">{template.icon}</div>
                <Badge variant="secondary">{template.category}</Badge>
              </div>
              <div>
                <CardTitle className="font-headline text-xl group-hover:text-primary transition-colors">
                  {template.name}
                </CardTitle>
                <CardDescription className="mt-2 line-clamp-2">
                  {template.description}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Parameters Preview */}
              {template.parameters.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Customizable:</p>
                  <div className="flex flex-wrap gap-1">
                    {template.parameters.slice(0, 3).map(param => (
                      <Badge key={param.key} variant="outline" className="text-xs">
                        {param.label}
                      </Badge>
                    ))}
                    {template.parameters.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{template.parameters.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {/* Color Palettes Preview */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Color Styles:</p>
                <div className="flex flex-wrap gap-1">
                  {template.colorPalettes.slice(0, 2).map(palette => (
                    <Badge key={palette} variant="outline" className="text-xs capitalize">
                      {palette}
                    </Badge>
                  ))}
                  {template.colorPalettes.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{template.colorPalettes.length - 2}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <Button 
                onClick={() => onSelectTemplate(template)}
                className="w-full group-hover:shadow-md transition-shadow"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Create Doodle
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No templates found matching your search.</p>
          <Button 
            variant="ghost" 
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
            }}
            className="mt-4"
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
