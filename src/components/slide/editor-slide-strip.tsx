'use client';
import * as React from 'react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Copy, Plus, Trash2 } from 'lucide-react';
import type { Slide } from '@/lib/types';
import { useTemplate } from '@/hooks/use-template';
import { SlideView } from './slide-view';
import { templates } from '@/lib/templates';
import { cn } from '@/lib/utils';
import { usePresentationSettings } from '@/hooks/use-presentation-settings';

// Horizontal slide item component
function HorizontalSlideItem({
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
  const previewWidth = 120; // Smaller width for horizontal strip
  const previewHeight = previewWidth / aspectRatio;
  
  return (
    <div
      className={cn(
        'relative group rounded-lg overflow-hidden border-2 cursor-pointer transition-all duration-200 flex-shrink-0',
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

interface EditorSlideStripProps {
  slides: Slide[];
  selectedSlide: Slide | null;
  onSelectSlide: (slide: Slide) => void;
  onDeleteSlide: (slideId: string) => void;
  onAddSlide: (layoutType: 'title' | 'content' | 'blank') => void;
  onDuplicateSlide: (slide: Slide) => void;
}

/**
 * A horizontal strip of slide thumbnails for navigation on smaller screens.
 */
export function EditorSlideStrip({ 
  slides, 
  selectedSlide, 
  onSelectSlide,
  onDeleteSlide,
  onAddSlide,
  onDuplicateSlide
}: EditorSlideStripProps) {
  const { selectedTemplate: nullableTemplate } = useTemplate();
  const selectedTemplate = nullableTemplate || templates[0];
  const selectedRef = React.useRef<HTMLDivElement>(null);
  
  // Automatically scroll the selected slide into the center of the view
  React.useEffect(() => {
    if (selectedRef.current) {
      selectedRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [selectedSlide]);
  
  const { layout: slideSize } = usePresentationSettings();
  const aspectRatio = slideSize.width / slideSize.height;
  const previewWidth = 120;
  const previewHeight = previewWidth / aspectRatio;
  
  return (
    <div className="w-full bg-background border-t p-1 shadow-sm">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex w-max space-x-2 p-1 items-center">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              ref={selectedSlide?.id === slide.id ? selectedRef : null}
            >
              <HorizontalSlideItem
                slide={slide}
                index={index}
                isSelected={selectedSlide?.id === slide.id}
                onSelect={() => onSelectSlide(slide)}
                onDelete={() => onDeleteSlide(slide.id)}
                onDuplicate={() => onDuplicateSlide(slide)}
              />
            </div>
          ))}
          
          {/* Add slide button */}
          <div className="flex-shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className="h-full border-dashed border-2 flex flex-col items-center justify-center gap-1 rounded-lg"
                  style={{ 
                    width: `${previewWidth}px`,
                    height: `${previewHeight}px`,
                    borderColor: `${selectedTemplate.colors.text}30`,
                    color: selectedTemplate.colors.text
                  }}
                >
                  <Plus className="w-5 h-5" />
                  <span className="text-xs">Add Slide</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-40">
                <DropdownMenuItem onClick={() => onAddSlide('title')}>
                  <span>Title Slide</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onAddSlide('content')}>
                  <span>Content Slide</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onAddSlide('blank')}>
                  <span>Blank Slide</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <ScrollBar orientation="horizontal" className="h-1.5" />
      </ScrollArea>
    </div>
  );
}