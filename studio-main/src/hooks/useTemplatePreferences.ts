"use client";

import { useState, useEffect } from 'react';
import { DoodleTemplate } from '@/types/templates';
import { DOODLE_TEMPLATES } from '@/data/templates';

const STORAGE_KEY = 'doodlesnap-favorite-templates';
const MAX_FAVORITES = 9;

export function useTemplatePreferences() {
  const [favoriteTemplateIds, setFavoriteTemplateIds] = useState<string[]>([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setFavoriteTemplateIds(parsed.slice(0, MAX_FAVORITES));
        }
      } else {
        // Set default favorites (first 7 templates)
        const defaultFavorites = DOODLE_TEMPLATES.slice(0, 7).map(t => t.id);
        setFavoriteTemplateIds(defaultFavorites);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultFavorites));
      }
    } catch (error) {
      console.error('Error loading template preferences:', error);
      // Fallback to first 7 templates
      const defaultFavorites = DOODLE_TEMPLATES.slice(0, 7).map(t => t.id);
      setFavoriteTemplateIds(defaultFavorites);
    }
  }, []);

  // Save to localStorage whenever favorites change
  useEffect(() => {
    if (favoriteTemplateIds.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteTemplateIds));
    }
  }, [favoriteTemplateIds]);

  const favoriteTemplates = favoriteTemplateIds
    .map(id => DOODLE_TEMPLATES.find(t => t.id === id))
    .filter(Boolean) as DoodleTemplate[];

  const addToFavorites = (templateId: string) => {
    setFavoriteTemplateIds(prev => {
      if (prev.includes(templateId) || prev.length >= MAX_FAVORITES) {
        return prev;
      }
      return [...prev, templateId];
    });
  };

  const removeFromFavorites = (templateId: string) => {
    setFavoriteTemplateIds(prev => prev.filter(id => id !== templateId));
  };

  const isFavorite = (templateId: string) => {
    return favoriteTemplateIds.includes(templateId);
  };

  const canAddMore = favoriteTemplateIds.length < MAX_FAVORITES;

  return {
    favoriteTemplates,
    favoriteTemplateIds,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    canAddMore,
    maxFavorites: MAX_FAVORITES
  };
}
