

'use client';

import * as React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Slide } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useTemplate } from '@/hooks/use-template';
import * as Lucide from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Trash2, 
} from 'lucide-react';

interface EditorSidebarProps {
  slides: Slide[];
  selectedSlide: Slide | null;
  onSelectSlide: (slide: Slide) => void;
  onDeleteSlide: (slideId: string) => void;
  onAddSlide: (layout: 'title' | 'content' | 'blank') => void;
}

export function EditorSidebar({ 
  slides, 
  selectedSlide, 
  onSelectSlide,
  onDeleteSlide,
  onAddSlide
}: EditorSidebarProps) {
  const { selectedTemplate } = useTemplate();
  
  return (
    <aside className="w-72 h-full border-r bg-background flex flex-col shadow-md">
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {slides.map((slide, index) => {
            const isSelected = selectedSlide?.id === slide.id;

            return (
              <div
                key={slide.id}
                onClick={() => onSelectSlide(slide)}
                className={cn(
                  'rounded-lg cursor-pointer border-2 relative group flex items-center transition-all duration-200',
                  isSelected
                    ? 'border-primary bg-primary/10' // Active state
                    : 'border-transparent hover:bg-accent' // Hover state
                )}
              >
                {/* --- Left selection indicator bar --- */}
                <div className={cn(
                  "absolute left-0 top-1/2 -translate-y-1/2 h-3/5 w-1 bg-primary rounded-r-full transition-opacity",
                  isSelected ? "opacity-100" : "opacity-0"
                )} />

                {/* --- Main card body, redesigned for clarity --- */}
                <div className="flex items-center gap-3 p-2 w-full">
                  <span className="text-sm font-medium text-muted-foreground w-5 text-center">{index + 1}</span>
                  
                  {/* --- Visual Thumbnail Preview --- */}
                  <div 
                      className="aspect-video w-24 flex-shrink-0 rounded-md p-2 flex flex-col justify-center items-center text-center shadow-inner-sm bg-muted/50 overflow-hidden"
                      style={{ background: selectedTemplate.background }}
                  >
                      <h3 className="text-[10px] font-bold leading-tight" style={{ color: selectedTemplate.colors.heading, fontFamily: selectedTemplate.font.headline }}>
                        {slide.title.substring(0, 30) + (slide.title.length > 30 ? '...' : '')}
                      </h3>
                      <div className="w-full space-y-1 mt-1">
                        <div className="h-1 w-full rounded-full" style={{ backgroundColor: selectedTemplate.colors.text, opacity: 0.5 }}></div>
                        <div className="h-1 w-3/4 rounded-full" style={{ backgroundColor: selectedTemplate.colors.text, opacity: 0.5 }}></div>
                      </div>
                  </div>

                  {/* --- Slide Title (Readable and Clean) --- */}
                  <div className="hidden flex-1 truncate">
                    <p className="w-full text-sm font-medium text-foreground truncate">{slide.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{slide.content.substring(0, 40)}...</p>
                  </div>
                  
                  {/* --- Hover Actions for a Cleaner UI --- */}
                  <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent slide selection when deleting
                        onDeleteSlide(slide.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </aside>
  );
}
