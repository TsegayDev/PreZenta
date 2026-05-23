"use client";
import * as React from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePresentationSettings } from '@/hooks/use-presentation-settings';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { RectangleHorizontal, Monitor, Tv, Tablet, Film } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PptxLayout } from '@/lib/types';

const layoutOptions: { 
  value: PptxLayout; 
  label: string; 
  dimensions: string; 
  width: number; 
  height: number;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
    { 
      value: 'LAYOUT_16x9', 
      label: 'Widescreen', 
      dimensions: '16:9', 
      width: 1920, 
      height: 1080,
      description: 'Standard for modern presentations',
      icon: Monitor
    },
    { 
      value: 'LAYOUT_16x10', 
      label: 'Widescreen (16:10)', 
      dimensions: '16:10', 
      width: 1920, 
      height: 1200,
      description: 'Common for laptops and monitors',
      icon: Monitor
    },
    { 
      value: 'LAYOUT_4x3', 
      label: 'Standard', 
      dimensions: '4:3', 
      width: 1920, 
      height: 1440,
      description: 'Traditional format for older displays',
      icon: Tablet
    },
    { 
      value: 'LAYOUT_WIDE', 
      label: 'Cinema', 
      dimensions: '21:9', 
      width: 2560, 
      height: 1080,
      description: 'Ultra-wide for cinematic presentations',
      icon: Film
    },
];

const LayoutPreview = ({ 
  width, 
  height, 
  isSelected 
}: { 
  width: number; 
  height: number; 
  isSelected: boolean;
}) => {
  // Calculate aspect ratio
  const aspectRatio = width / height;
  
  // Normalize dimensions for preview - smaller size
  const previewWidth = aspectRatio > 1 ? 40 : 30;
  const previewHeight = previewWidth / aspectRatio;
  
  return (
    <div className="flex flex-col items-center">
      <div 
        className={cn(
          "border rounded overflow-hidden transition-all duration-200",
          isSelected 
            ? "border-primary shadow-sm ring-1 ring-primary/20" 
            : "border-border"
        )}
        style={{ 
          width: `${previewWidth}px`, 
          height: `${previewHeight}px` 
        }}
      >
        <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
          <div className="w-3/4 h-1/2 bg-white/30 rounded-sm"></div>
        </div>
      </div>
      <span className="text-[10px] mt-0.5 text-muted-foreground">
        {width}×{height}
      </span>
    </div>
  );
};

export function SlideSizeSelector() {
  const { layout, setLayout } = usePresentationSettings();
  
  const handleLayoutChange = (value: PptxLayout) => {
    const selected = layoutOptions.find(o => o.value === value);
    if (selected) {
      setLayout({ name: selected.value, width: selected.width, height: selected.height });
    }
  };
  
  // Get current layout info
  const currentLayout = layoutOptions.find(o => o.value === layout.name) || layoutOptions[0];
  const CurrentIcon = currentLayout.icon;
  
  return (
    <Card className="bg-transparent border-0 shadow-none">
      <CardHeader className="px-1 pt-0 pb-2">
        <CardTitle className="font-headline text-base flex items-center gap-2">
          <RectangleHorizontal className="w-4 h-4" />
          Slide Size
        </CardTitle>
        <p className="text-xs text-muted-foreground pt-0.5">Choose your slide aspect ratio</p>
      </CardHeader>
      <CardContent className="p-1">
        <Select onValueChange={handleLayoutChange} value={layout.name}>
          <SelectTrigger className="rounded w-full h-9 bg-muted/50 hover:bg-accent text-sm">
            <div className="flex items-center gap-2">
              <CurrentIcon className="h-4 w-4 text-muted-foreground" />
              <div className="flex flex-col items-start">
                <span>{currentLayout.label}</span>
                <span className="text-[10px] text-muted-foreground">{currentLayout.dimensions}</span>
              </div>
            </div>
          </SelectTrigger>
          <SelectContent className="w-64">
            <SelectGroup>
              <SelectLabel className="text-xs font-normal text-muted-foreground">
                Aspect Ratio
              </SelectLabel>
              {layoutOptions.map(option => {
                const Icon = option.icon;
                const isSelected = layout.name === option.value;
                return (
                  <SelectItem 
                    key={option.value} 
                    value={option.value}
                    className="py-2"
                  >
                    <div className="flex items-center gap-2 w-full">
                      <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <div className="flex flex-col gap-0.5 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{option.label}</span>
                          <Badge variant="outline" className="text-[10px] h-5 px-1.5">
                            {option.dimensions}
                          </Badge>
                        </div>
                        <p className="text-[10px] text-muted-foreground">
                          {option.description}
                        </p>
                      </div>
                      <LayoutPreview 
                        width={option.width} 
                        height={option.height} 
                        isSelected={isSelected}
                      />
                    </div>
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
        
        {/* Current selection preview - more compact */}
        <div className="mt-3 p-2 rounded-md bg-muted/50 border border-border">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium">Current Selection</span>
            <Badge variant="secondary" className="text-[10px] h-5 px-1.5">
              {currentLayout.dimensions}
            </Badge>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-center">
              <div className="text-[10px] text-muted-foreground mb-0.5">Preview</div>
              <LayoutPreview 
                width={currentLayout.width} 
                height={currentLayout.height} 
                isSelected={true}
              />
            </div>
            
            <div className="flex flex-col gap-0.5 text-xs">
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">Dimensions:</span>
                <span className="font-medium">{currentLayout.width} × {currentLayout.height}px</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">Ratio:</span>
                <span className="font-medium">{currentLayout.dimensions}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">Type:</span>
                <span className="font-medium">{currentLayout.label}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}