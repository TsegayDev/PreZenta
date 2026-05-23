'use client';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { 
    Download, 
    Share2, 
    Play, 
    ChevronLeft, 
    Loader2, 
    PanelLeft, 
    PanelRight, 
    PanelLeftClose, 
    PanelRightClose,
    Minus,
    Plus,
} from 'lucide-react';
import { useSlideEditor } from '@/hooks/use-slide-editor';
import { Logo } from '../logo';
import { useTemplate } from '@/hooks/use-template';
import type { Slide } from '@/lib/types';
import { generatePptx } from '@/lib/pptx-generator';
import { useToast } from '@/hooks/use-toast';
import { TransitionSelector } from './transition-selector';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { usePresentationSettings } from '@/hooks/use-presentation-settings';

interface EditorHeaderProps {
    slides: Slide[];
    setSlides: React.Dispatch<React.SetStateAction<Slide[]>>;
    toggleLeftSidebar: () => void;
    toggleRightSidebar: () => void;
    isLeftSidebarOpen: boolean;
    isRightSidebarOpen: boolean;
    initialTitle: string;
    onTitleChange: (newTitle: string) => void;
    zoomLevel: number;
    onZoomChange: (zoom: number) => void;
    onFitToScreen: () => void;
}

export function EditorHeader({ 
    slides, 
    setSlides, 
    toggleLeftSidebar, 
    toggleRightSidebar, 
    isLeftSidebarOpen, 
    isRightSidebarOpen,
    initialTitle,
    onTitleChange,
    zoomLevel,
    onZoomChange,
    onFitToScreen
}: EditorHeaderProps) {
  const { closeEditor, startPresentation } = useSlideEditor();
  const { selectedTemplate } = useTemplate();
  const { layout } = usePresentationSettings();
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = React.useState(false);
  const [presentationTitle, setPresentationTitle] = React.useState(initialTitle);
  const [isSavingTitle, setIsSavingTitle] = React.useState(false);
  
  const handleDownload = async () => {
    if (!slides || slides.length === 0) {
        toast({ title: "Error", description: "No slide content available to download.", variant: "destructive" });
        return;
    }
    setIsDownloading(true);
    try {
        toast({ title: "Creating Presentation", description: "Building the PPTX file..." });
        await generatePptx(slides, selectedTemplate, layout);
        toast({ title: "Download Complete!", description: "Your presentation has been saved." });
    } catch (error) {
        console.error("Failed to generate PPTX:", error);
        toast({ title: "Error", description: "Failed to generate presentation.", variant: "destructive" });
    } finally {
        setIsDownloading(false);
    }
  }
  
  const handleShare = () => {
    toast({
        title: "Sharing coming soon!",
        description: "This feature is currently under development."
    });
  }
  
  const handleTitleBlur = () => {
    if (initialTitle === presentationTitle) return;
    setIsSavingTitle(true);
    setTimeout(() => {
        onTitleChange(presentationTitle);
        setIsSavingTitle(false);
        toast({ title: "Renamed", description: `Presentation saved as "${presentationTitle}"`});
    }, 750);
  }
  
  const handleZoom = (direction: 'in' | 'out') => {
    const change = direction === 'in' ? 0.1 : -0.1;
    onZoomChange(Math.max(0.1, zoomLevel + change));
  }
  
  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between border-b bg-background/90 px-2 sm:px-3 w-full backdrop-blur-md">
      
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={closeEditor}>
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 hidden lg:flex" onClick={toggleLeftSidebar}>
            {isLeftSidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeft className="h-4 w-4" />}
            <span className="sr-only">Toggle Left Sidebar</span>
        </Button>
        <div className="block">
            <Logo className="w-7 h-7" />
        </div>
      </div>
      
      <div className="flex flex-1 px-3 items-center justify-center gap-3 min-w-0">
          <div className="hidden md:block relative w-full max-w-xs">
            <input
                type="text"
                value={presentationTitle}
                onChange={(e) => setPresentationTitle(e.target.value)}
                onBlur={handleTitleBlur}
                className="w-full text-sm font-semibold text-center truncate bg-transparent border-none rounded-md p-1 focus:bg-accent focus:ring-1 focus:ring-primary"
            />
            {isSavingTitle && <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">Saving...</span>}
          </div>
          
        <div className="flex items-center gap-0.5 p-0.5 rounded-md bg-muted/70">
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleZoom('out')}><Minus className="h-3.5 w-3.5" /></Button>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-6 w-16 text-xs font-mono">{Math.round(zoomLevel * 100)}%</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onSelect={() => onZoomChange(0.5)}>50%</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => onZoomChange(1)}>100% (Actual Size)</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => onZoomChange(2)}>200%</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={onFitToScreen}>Fit to Screen</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleZoom('in')}><Plus className="h-3.5 w-3.5" /></Button>
        </div>
      </div>
      
      <div className="flex items-center gap-1 sm:gap-1.5">
        <div className="hidden md:block">
          <TransitionSelector slides={slides} setSlides={setSlides} />
        </div>
        
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 px-1.5 sm:px-2">
                    <Share2 className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline ml-1.5 text-xs">Export</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={handleShare}>
                    <Share2 className="mr-2 h-4 w-4" />
                    Share Link
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={handleDownload} disabled={isDownloading}>
                    {isDownloading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Download className="mr-2 h-4 w-4" />
                    )}
                    Download PPTX
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        
        <Button variant="default" size="sm" onClick={startPresentation} className="h-8 px-1.5 sm:px-2">
          <Play className="h-3.5 w-3.5" />
          <span className="hidden sm:inline ml-1.5 text-xs">Present</span>
        </Button>
        
        <Button variant="ghost" size="icon" className="h-8 w-8 hidden md:flex" onClick={toggleRightSidebar}>
            {isRightSidebarOpen ? <PanelRightClose className="h-4 w-4" /> : <PanelRight className="h-4 w-4" />}
            <span className="sr-only">Toggle Right Sidebar</span>
        </Button>
      </div>
    </header>
  );
}