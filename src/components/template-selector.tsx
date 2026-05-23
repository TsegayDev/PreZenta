'use client';
import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';
import { templates } from '@/lib/templates';
import { Template } from '@/lib/types';
import { useTemplate } from '@/hooks/use-template';
import { cn } from '@/lib/utils';
import {
  Check,
  Palette,
  Sun,
  Moon,
  Zap,
  Grid3X3,
  ChevronDown,
  Sparkles,
  Scroll,
} from 'lucide-react';

const typedTemplates: Template[] = templates;

const TemplatePreview = ({
  template,
  isSelected,
  onSelect,
}: {
  template: Template;
  isSelected: boolean;
  onSelect: () => void;
}) => {
  return (
    <div
      className={cn(
        'relative  group rounded-lg overflow-hidden border transition-all duration-200 cursor-pointer',
        isSelected
          ? 'border-primary shadow-sm ring-1 ring-primary/20'
          : 'border-transparent hover:border-primary/50',
      )}
      onClick={onSelect}
    >
      <div
        className="relative w-full h-[50px] p-2 flex flex-col justify-center overflow-hidden"
        style={{
          background: template.background,
          backgroundColor: template.colors.background,
        }}
      >
        {/* Decorative elements */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <div
            className="w-10 h-10 rounded-full"
            style={{ backgroundColor: template.colors.primary }}
          ></div>
        </div>
        {/* Content preview */}
        <div className="relative z-10 w-full space-y-1">
          <h3
            className="font-bold text-sm truncate"
            style={{
              color: template.colors.heading,
              fontFamily: template.font.headline,
            }}
          >
            Title
          </h3>
          <div className="space-y-1">
            <div
              className="h-1 w-full rounded-full"
              style={{ backgroundColor: template.colors.text, opacity: 0.7 }}
            ></div>
            <div
              className="h-1 w-3/4 rounded-full"
              style={{ backgroundColor: template.colors.text, opacity: 0.7 }}
            ></div>
          </div>
        </div>
        {/* Selection indicator */}
        {isSelected && (
          <div className="absolute top-1 right-1 bg-primary text-white rounded-full p-0.5">
            <Check className="w-3 h-3" />
          </div>
        )}
      </div>
      {/* Template name with theme indicator */}
      <div className="p-1 bg-background/50 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <span
            className={cn(
              'text-xs font-medium truncate',
              isSelected ? 'text-primary' : 'text-muted-foreground',
            )}
          >
            {template.name}
          </span>
          <Badge
            variant="secondary"
            className={cn(
              'text-xs h-4 px-1 text-[10px]',
              template.theme === 'light' && 'bg-amber-100 text-amber-800',
              template.theme === 'dark' && 'bg-slate-800 text-slate-100',
              template.category === 'gradient' && 'bg-purple-100 text-purple-800',
              template.category === 'pattern' && 'bg-blue-100 text-blue-800',
            )}
          >
            {template.theme === 'light' && <Sun className="w-2 h-2 mr-0.5" />}
            {template.theme === 'dark' && <Moon className="w-2 h-2 mr-0.5" />}
            {template.category === 'gradient' && <Zap className="w-2 h-2 mr-0.5" />}
            {template.category === 'pattern' && <Grid3X3 className="w-2 h-2 mr-0.5" />}
          </Badge>
        </div>
      </div>
    </div>
  );
};

const TemplateGrid = ({
  templates,
  selectedTemplate,
  onSelect,
}: {
  templates: Template[];
  selectedTemplate: Template | null;
  onSelect: (template: Template) => void;
}) => {
  return (
    <div className="grid grid-cols-1 gap-2 rounded">
      {templates.map((template) => (
        <TemplatePreview
          key={template.id}
          template={template}
          isSelected={selectedTemplate?.id === template.id}
          onSelect={() => onSelect(template)}
        />
      ))}
    </div>
  );
};

const ScrollableTemplateGrid = ({
  templates,
  selectedTemplate,
  onSelect,
  maxHeight = 250,
}: {
  templates: Template[];
  selectedTemplate: Template | null;
  onSelect: (template: Template) => void;
  maxHeight?: number;
}) => {
  return (
    <div className="overflow-y-auto" style={{ maxHeight }}>
      <div className="p-2">
        <TemplateGrid
          templates={templates}
          selectedTemplate={selectedTemplate}
          onSelect={onSelect}
        />
      </div>
    </div>
  );
};

export function TemplateSelector() {
  const { selectedTemplate, setSelectedTemplate } = useTemplate();
  const lightTemplates = typedTemplates.filter(
    (t) => t.theme === 'light' && t.category === 'standard',
  );
  const darkTemplates = typedTemplates.filter(
    (t) => t.theme === 'dark' && t.category === 'standard',
  );
  const gradientTemplates = typedTemplates.filter(
    (t) => t.category === 'gradient',
  );
  const patternTemplates = typedTemplates.filter(
    (t) => t.category === 'pattern',
  );

  // Get current template info for display
  const getCurrentTemplateInfo = () => {
    if (!selectedTemplate) return { theme: 'light', category: 'standard' };
    return {
      theme: selectedTemplate.theme,
      category: selectedTemplate.category,
    };
  };

  const { theme, category } = getCurrentTemplateInfo();

  // Get theme icon
  const getThemeIcon = () => {
    if (theme === 'light') return <Sun className="w-3 h-3" />;
    if (theme === 'dark') return <Moon className="w-3 h-3" />;
    if (category === 'gradient') return <Zap className="w-3 h-3" />;
    if (category === 'pattern') return <Grid3X3 className="w-3 h-3" />;
    return <Palette className="w-3 h-3" />;
  };

  // Get theme label
  const getThemeLabel = () => {
    if (theme === 'light') return 'Light';
    if (theme === 'dark') return 'Dark';
    if (category === 'gradient') return 'Gradient';
    if (category === 'pattern') return 'Pattern';
    return 'Theme';
  };

  return (
    <Card className="w-full">
      <CardHeader className="px-3 pt-3 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Palette className="w-4 h-4" />
          Theme
        </CardTitle>
        <p className="text-xs text-muted-foreground pt-0.5">
          Choose a presentation theme
        </p>
      </CardHeader>
      
      <CardContent className="pt-0 pb-3 px-3 space-y-3">
        {/* Full-width dropdown button */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center justify-between w-full h-9 bg-muted/50 hover:bg-accent text-sm px-3 rounded"
            >
              <div className="flex items-center gap-2">
                {selectedTemplate ? (
                  <>
                    {getThemeIcon()}
                    <span className="max-w-[120px] truncate">{getThemeLabel()}</span>
                  </>
                ) : (
                  <>
                    <Palette className="w-3 h-3" />
                    <span>Select Theme</span>
                  </>
                )}
              </div>
              <ChevronDown className="w-3 h-3 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="text-xs py-1.5">
                <Sun className="w-3 h-3 mr-2" />
                Light
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <ScrollableTemplateGrid
                  templates={lightTemplates}
                  selectedTemplate={selectedTemplate}
                  onSelect={setSelectedTemplate}
                />
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="text-xs py-1.5">
                <Moon className="w-3 h-3 mr-2" />
                Dark
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <ScrollableTemplateGrid
                  templates={darkTemplates}
                  selectedTemplate={selectedTemplate}
                  onSelect={setSelectedTemplate}
                />
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="text-xs py-1.5">
                <Zap className="w-3 h-3 mr-2" />
                Gradient
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <ScrollableTemplateGrid
                  templates={gradientTemplates}
                  selectedTemplate={selectedTemplate}
                  onSelect={setSelectedTemplate}
                />
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="text-xs py-1.5">
                <Grid3X3 className="w-3 h-3 mr-2" />
                Pattern
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <ScrollableTemplateGrid
                  templates={patternTemplates}
                  selectedTemplate={selectedTemplate}
                  onSelect={setSelectedTemplate}
                />
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-xs py-1.5" onClick={() => setSelectedTemplate(templates[0])}>
              <Sparkles className="w-3 h-3 mr-2" />
              Surprise Me!
            </DropdownMenuItem>
            <DropdownMenuItem className="text-xs py-1.5" onClick={() => setSelectedTemplate(null)}>
              <Scroll className="w-3 h-3 mr-2" />
              Use Current
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Current selection preview */}
        {selectedTemplate ? (
          <TemplateGrid
            templates={[selectedTemplate]}
            selectedTemplate={selectedTemplate}
            onSelect={() => {}}
          />
        ) : (
          <div className="text-center text-muted-foreground text-xs py-2">
            No template selected
          </div>
        )}
      </CardContent>
    </Card>
  );
}