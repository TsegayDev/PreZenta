'use client';
import * as React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Copy, Plus, Trash2, X } from 'lucide-react';
import type { Slide } from '@/lib/types';
import { useTemplate } from '@/hooks/use-template';
import { SlideView } from './slide-view';
import { templates } from '@/lib/templates';
import { cn } from '@/lib/utils';
import { usePresentationSettings } from '@/hooks/use-presentation-settings';

export function CompactSlideItem({
  slide,
  index,
  isSelected,
  onSelect,
  onDelete,
  onDuplicate
}: {
  slide: Slide;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}) {
  const { selectedTemplate: nullableTemplate } = useTemplate();
  const selectedTemplate = nullableTemplate || templates[0];
  const { layout: slideSize } = usePresentationSettings();
  const aspectRatio = slideSize.width / slideSize.height;
  const previewWidth = 160;
  const previewHeight = previewWidth / aspectRatio;
  
  return (
    <div
      className={cn(
        'relative group rounded-lg overflow-hidden border-2 cursor-pointer transition-all duration-200 flex-shrink-0 mb-2',
        isSelected 
          ? 'ring-0 ring-primary shadow-lg' 
          : 'border-transparent hover:border-primary/30'
      )}
      onClick={onSelect}
      style={{ 
        borderColor: isSelected ? selectedTemplate.colors.primary : undefined,
        width: `${previewWidth}px`,
        height: `${previewHeight}px`
      }}
    >
        <div className="w-full h-full bg-background/50 transform origin-top-left" style={{ transform: `scale(${previewWidth / slideSize.width})`}}>
            <SlideView slide={slide} />
        </div>
      
      {/* Slide Number */}
      <div className={cn(
          "absolute top-1 left-1 h-5 w-5 flex items-center justify-center rounded-full text-[10px] font-bold z-10 transition-colors",
          isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
      )}>
          {index + 1}
      </div>
      {/* Action buttons overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-1">
        <div className="flex justify-end gap-1">
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6 text-white bg-black/40 hover:bg-black/60 hover:text-primary backdrop-blur-sm rounded-full"
            onClick={(e) => { e.stopPropagation(); onDuplicate(); }}
            title="Duplicate slide"
          >
            <Copy className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6 text-white bg-black/40 hover:bg-black/60 hover:text-red-600 backdrop-blur-sm rounded-full"
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            title="Delete slide"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
export function CompactSlideList({
  slides,
  selectedSlide,
  onSelectSlide,
  onDeleteSlide,
  onAddSlide,
  onDuplicateSlide,
  toggleSidebar,
}: {
  slides: Slide[];
  selectedSlide: Slide | null;
  onSelectSlide: (slide: Slide) => void;
  onDeleteSlide: (slideId: string) => void;
  onAddSlide: (layoutType: 'title' | 'content' | 'blank') => void;
  onDuplicateSlide: (slide: Slide) => void;
  toggleSidebar: () => void;
}) {
  return (
    <div className="flex flex-col h-full bg-card/50 relative">
      {/* Header with close button */}
      <div className="p-3 border-b flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="font-bold text-foreground">{slides.length}</span>
          <p className="text-sm font-semibold text-muted-foreground">Slides</p>
        </div>
        <Button
          size="icon"
          variant="ghost"
          className="h-6 w-6"
          onClick={toggleSidebar}
          title="Close sidebar"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-2">
          {slides.map((slide, index) => (
            <CompactSlideItem
              key={slide.id}
              slide={slide}
              index={index}
              isSelected={selectedSlide?.id === slide.id}
              onSelect={() => onSelectSlide(slide)}
              onDelete={() => onDeleteSlide(slide.id)}
              onDuplicate={() => onDuplicateSlide(slide)}
            />
          ))}
        </div>
      </ScrollArea>
      
      <div className="p-2 border-t">
        <Button variant="outline" className="w-full" onClick={() => onAddSlide('content')}>
          <Plus className="h-4 w-4 mr-2" />
          Add Slide
        </Button>
      </div>
    </div>
  );
}