'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ColorPicker } from '@/components/ui/color-picker';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify,
  MoveUp,
  MoveDown,
  BringToFront,
  SendToBack,
  RotateCcw,
  Lock,
  Unlock
} from 'lucide-react';
import type { Slide, SlideElement } from '@/lib/types';

interface ElementPropertiesPanelProps {
  selectedSlide: Slide | null;
  onSlideChange: (updatedSlide: Slide) => void;
}

export function ElementPropertiesPanel({ selectedSlide, onSlideChange }: ElementPropertiesPanelProps) {
  if (!selectedSlide) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        No slide selected
      </div>
    );
  }

  // Find the selected element (assuming we have a selectedElementId in the slide)
  const selectedElement = selectedSlide.elements?.find(
    el => el.id === selectedSlide.selectedElementId
  );

  if (!selectedElement) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        Select an element to edit its properties
      </div>
    );
  }

  const updateElement = (updates: Partial<SlideElement>) => {
    if (!selectedSlide) return;
    
    const updatedElements = selectedSlide.elements?.map(el => 
      el.id === selectedElement.id ? { ...el, ...updates } : el
    ) || [];
    
    onSlideChange({
      ...selectedSlide,
      elements: updatedElements
    });
  };

  const handlePositionChange = (axis: 'x' | 'y', value: number) => {
    updateElement({
      position: {
        ...selectedElement.position,
        [axis]: value
      }
    });
  };

  const handleSizeChange = (dimension: 'width' | 'height', value: number) => {
    updateElement({
      size: {
        ...selectedElement.size,
        [dimension]: value
      }
    });
  };

  const handleFontStyleChange = (style: 'bold' | 'italic' | 'underline', value: boolean) => {
    updateElement({
      fontStyle: {
        ...selectedElement.fontStyle,
        [style]: value
      }
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Element Properties</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="element-type" className="text-xs">Type</Label>
            <Select 
              value={selectedElement.type} 
              onValueChange={(value) => updateElement({ type: value as any })}
            >
              <SelectTrigger id="element-type" className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="heading">Heading</SelectItem>
                <SelectItem value="paragraph">Paragraph</SelectItem>
                <SelectItem value="image">Image</SelectItem>
                <SelectItem value="shape">Shape</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="element-content" className="text-xs">Content</Label>
            <Input
              id="element-content"
              value={selectedElement.content || ''}
              onChange={(e) => updateElement({ content: e.target.value })}
              className="h-8 text-xs"
            />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="position" className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-8">
          <TabsTrigger value="position" className="text-xs">Position</TabsTrigger>
          <TabsTrigger value="style" className="text-xs">Style</TabsTrigger>
          <TabsTrigger value="effects" className="text-xs">Effects</TabsTrigger>
        </TabsList>
        
        <TabsContent value="position" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Position & Size</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs">X Position</Label>
                  <div className="flex items-center space-x-2">
                    <Slider
                      value={[selectedElement.position?.x || 0]}
                      onValueChange={(value) => handlePositionChange('x', value[0])}
                      max={1000}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-xs w-10">{selectedElement.position?.x || 0}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs">Y Position</Label>
                  <div className="flex items-center space-x-2">
                    <Slider
                      value={[selectedElement.position?.y || 0]}
                      onValueChange={(value) => handlePositionChange('y', value[0])}
                      max={1000}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-xs w-10">{selectedElement.position?.y || 0}</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs">Width</Label>
                  <div className="flex items-center space-x-2">
                    <Slider
                      value={[selectedElement.size?.width || 100]}
                      onValueChange={(value) => handleSizeChange('width', value[0])}
                      max={1000}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-xs w-10">{selectedElement.size?.width || 100}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs">Height</Label>
                  <div className="flex items-center space-x-2">
                    <Slider
                      value={[selectedElement.size?.height || 100]}
                      onValueChange={(value) => handleSizeChange('height', value[0])}
                      max={1000}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-xs w-10">{selectedElement.size?.height || 100}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 text-xs"
                  onClick={() => updateElement({ 
                    zIndex: (selectedElement.zIndex || 0) + 1 
                  })}
                >
                  <BringToFront className="h-3 w-3 mr-1" />
                  Bring to Front
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 text-xs"
                  onClick={() => updateElement({ 
                    zIndex: Math.max(0, (selectedElement.zIndex || 0) - 1) 
                  })}
                >
                  <SendToBack className="h-3 w-3 mr-1" />
                  Send to Back
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="style" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Text Style</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs">Font Family</Label>
                <Select 
                  value={selectedElement.fontStyle?.family || 'Arial'} 
                  onValueChange={(value) => updateElement({ 
                    fontStyle: { ...selectedElement.fontStyle, family: value } 
                  })}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Arial">Arial</SelectItem>
                    <SelectItem value="Verdana">Verdana</SelectItem>
                    <SelectItem value="Georgia">Georgia</SelectItem>
                    <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                    <SelectItem value="Courier New">Courier New</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-xs">Font Size</Label>
                <div className="flex items-center space-x-2">
                  <Slider
                    value={[selectedElement.fontStyle?.size || 16]}
                    onValueChange={(value) => updateElement({ 
                      fontStyle: { ...selectedElement.fontStyle, size: value[0] } 
                    })}
                    max={72}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-xs w-8">{selectedElement.fontStyle?.size || 16}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-xs">Font Color</Label>
                <ColorPicker
                  value={selectedElement.fontStyle?.color || '#000000'}
                  onChange={(color) => updateElement({ 
                    fontStyle: { ...selectedElement.fontStyle, color } 
                  })}
                />
              </div>
              
              <div className="flex space-x-1">
                <Button
                  variant={selectedElement.fontStyle?.bold ? "default" : "outline"}
                  size="sm"
                  className="flex-1 h-8"
                  onClick={() => handleFontStyleChange('bold', !selectedElement.fontStyle?.bold)}
                >
                  <Bold className="h-4 w-4" />
                </Button>
                <Button
                  variant={selectedElement.fontStyle?.italic ? "default" : "outline"}
                  size="sm"
                  className="flex-1 h-8"
                  onClick={() => handleFontStyleChange('italic', !selectedElement.fontStyle?.italic)}
                >
                  <Italic className="h-4 w-4" />
                </Button>
                <Button
                  variant={selectedElement.fontStyle?.underline ? "default" : "outline"}
                  size="sm"
                  className="flex-1 h-8"
                  onClick={() => handleFontStyleChange('underline', !selectedElement.fontStyle?.underline)}
                >
                  <Underline className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex space-x-1">
                <Button
                  variant={selectedElement.fontStyle?.align === 'left' ? "default" : "outline"}
                  size="sm"
                  className="flex-1 h-8"
                  onClick={() => updateElement({ 
                    fontStyle: { ...selectedElement.fontStyle, align: 'left' } 
                  })}
                >
                  <AlignLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant={selectedElement.fontStyle?.align === 'center' ? "default" : "outline"}
                  size="sm"
                  className="flex-1 h-8"
                  onClick={() => updateElement({ 
                    fontStyle: { ...selectedElement.fontStyle, align: 'center' } 
                  })}
                >
                  <AlignCenter className="h-4 w-4" />
                </Button>
                <Button
                  variant={selectedElement.fontStyle?.align === 'right' ? "default" : "outline"}
                  size="sm"
                  className="flex-1 h-8"
                  onClick={() => updateElement({ 
                    fontStyle: { ...selectedElement.fontStyle, align: 'right' } 
                  })}
                >
                  <AlignRight className="h-4 w-4" />
                </Button>
                <Button
                  variant={selectedElement.fontStyle?.align === 'justify' ? "default" : "outline"}
                  size="sm"
                  className="flex-1 h-8"
                  onClick={() => updateElement({ 
                    fontStyle: { ...selectedElement.fontStyle, align: 'justify' } 
                  })}
                >
                  <AlignJustify className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="effects" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Effects & Layers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Lock Position</Label>
                <Switch
                  checked={selectedElement.locked || false}
                  onCheckedChange={(checked) => updateElement({ locked: checked })}
                />
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label className="text-xs">Rotation</Label>
                <div className="flex items-center space-x-2">
                  <Slider
                    value={[selectedElement.rotation || 0]}
                    onValueChange={(value) => updateElement({ rotation: value[0] })}
                    max={360}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-xs w-10">{selectedElement.rotation || 0}°</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-xs">Opacity</Label>
                <div className="flex items-center space-x-2">
                  <Slider
                    value={[(selectedElement.opacity || 1) * 100]}
                    onValueChange={(value) => updateElement({ opacity: value[0] / 100 })}
                    max={100}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-xs w-10">{Math.round((selectedElement.opacity || 1) * 100)}%</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-xs">Background Color</Label>
                <ColorPicker
                  value={selectedElement.background?.color || '#ffffff'}
                  onChange={(color) => updateElement({ 
                    background: { ...selectedElement.background, color } 
                  })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
