'use client';
import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSlideEditor } from '@/hooks/use-slide-editor';
import { EditorHeader } from '@/components/slide/editor-header';
import { CompactSlideList } from '@/components/slide/compact-slide-list';
import { PresentationView } from '@/components/slide/presentation-view';
import { SlideView } from '@/components/slide/slide-view';
import { SlidePreview } from '@/components/slide/slide-preview';
import type { Slide, Template } from '@/lib/types';
import { useZoom } from '@/hooks/use-zoom';
import { usePresentationSettings, PresentationSettingsProvider } from '@/hooks/use-presentation-settings';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';
import { useTemplate, TemplateProvider } from '@/hooks/use-template';
import { usePresentationHistory } from '@/hooks/use-presentation-history';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TemplateSelector } from '@/components/template-selector';
import { SlideSizeSelector } from '@/components/slide/slide-size-selector';
import { parseOutline } from '@/lib/parser';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { FilmIcon, PanelLeft, PanelRight, X } from 'lucide-react';
import { SlideLayoutSelector } from '@/components/slide/slide-layout-selector';
import { templates } from '@/lib/templates';
import { EditorSlideStrip } from '@/components/slide/editor-slide-strip';
import { ZoomControls, ZoomLevelIndicator } from '@/components/zoom-controls';
import { usePageProgress } from '@/hooks/use-page-progress';

// Zoom constants
const MIN_ZOOM = 0.1;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.1;

// Wrapper component to provide context for slide export rendering
const SlideExportWrapper = ({ slide, template }: { slide: Slide, template: Template | null }) => {
    const { setSelectedTemplate } = useTemplate();
    React.useEffect(() => {
        if(template){
            setSelectedTemplate(template)
        }
    }, [template, setSelectedTemplate]);
    return (
        <PresentationSettingsProvider>
            <SlideView slide={slide} templateOverride={template} />
        </PresentationSettingsProvider>
    );
}

const BgExportWrapper = ({ slide, template,type }: { slide: Slide, template: Template | null, type: String | 'bg-only' }) => {
    const { setSelectedTemplate } = useTemplate();
    React.useEffect(() => {
        if(template){
            setSelectedTemplate(template)
        }
    }, [template, setSelectedTemplate]);
    return (
        <PresentationSettingsProvider>
            <SlidePreview slide={slide} template={template} type={type} />
        </PresentationSettingsProvider>
    );
}

// Pattern background component
function PatternBackground() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="pointer-events-none">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
          </pattern>
          <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="currentColor" opacity="0.15" />
            <circle cx="12" cy="12" r="1" fill="currentColor" opacity="0.15" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        <rect width="100%" height="100%" fill="url(#dots)" />
      </svg>
    </div>
  );
}

function RightSidebarContent({
  selectedSlide,
  onSlideChange,
  toggleSidebar,
}: {
  selectedSlide: Slide | null;
  onSlideChange: (updatedSlide: Slide) => void;
  toggleSidebar: () => void;
}) {
  return (
    <ScrollArea className="h-full">
      <div className="p-3 space-y-4">
        
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Presentation</h3>
          <div className="space-y-2">
            <TemplateSelector />
            <SlideSizeSelector />
          </div>
        </div>
        
        {selectedSlide && (
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Slide</h3>
            <SlideLayoutSelector
              selectedSlide={selectedSlide}
              onSlideChange={onSlideChange}
            />
          </div>
        )}
      </div>
    </ScrollArea>
  );
}

export default function SlideEditorPage() {
  const { finish: finishProgress } = usePageProgress();
  React.useEffect(() => {
    finishProgress();
  }, [finishProgress]);
  
  const {
    outline,
    isPresenting,
    presentationId,
    autosavePresentation,
  } = useSlideEditor();
  
  const { zoomLevel, setZoomLevel, pan, workspaceRef, contentRef, fitToScreen, handleMouseDown } = useZoom();
  const { layout } = usePresentationSettings();
  const { toast } = useToast();
  const { selectedTemplate, setSelectedTemplate } = useTemplate();
  const {
    history,
    isHistoryLoaded,
  } = usePresentationHistory();
  
  const [slides, setSlides] = React.useState<Slide[]>([]);
  const [selectedSlide, setSelectedSlide] = React.useState<Slide | null>(null);
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = React.useState(true);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = React.useState(true);
  const [title, setTitle] = React.useState('Welcome to PreZenta');
  const [currentId, setCurrentId] = React.useState<string | null>(presentationId);
  const isInitialLoad = React.useRef(true);
  const [isDefaultSlide, setIsDefaultSlide] = React.useState(false);
  
  // Refs for slide previews used in export
  const bgPreviewRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const slidePreviewRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  
  // Handle ctrl+scroll zoom and prevent browser zoom
  React.useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Check if Ctrl or Cmd key is pressed
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        e.stopPropagation();
        
        // Calculate zoom direction
        const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
        
        // Apply zoom with boundaries
        setZoomLevel(prev => {
          const newZoom = prev + delta;
          return Math.min(Math.max(newZoom, MIN_ZOOM), MAX_ZOOM);
        });
      }
    };

    // Add event listener to the document with passive: false to allow preventDefault
    document.addEventListener('wheel', handleWheel, { passive: false, capture: true });

    return () => {
      document.removeEventListener('wheel', handleWheel, { capture: true });
    };
  }, [setZoomLevel]);
  
  // Initialize slides from history or outline
  React.useEffect(() => {
    if (!isHistoryLoaded) return;
  
    let initialSlides: Slide[] = [];
    let initialTitle = 'Welcome to PreZenta';
    let loadedFromHistory = false;
  
    if (presentationId) {
      const existing = history.find(h => h.id === presentationId);
      if (existing) {
        try {
          initialSlides = JSON.parse(existing.detailedContent);
          initialTitle = existing.title;
          const foundTemplate = templates.find(t => t.id === existing.templateId) || templates[0];
          setSelectedTemplate(foundTemplate);
          loadedFromHistory = true;
        } catch (e) {
          console.error("Failed to parse existing presentation content.", e);
          toast({ title: "Error loading presentation", variant: 'destructive' });
        }
      }
    }
  
    if (!loadedFromHistory && outline) {
      initialSlides = parseOutline(outline);
      if (initialSlides.length > 0) {
        initialTitle = initialSlides[0].title;
      }
    }
  
    if (initialSlides.length === 0) {
      initialSlides.push({
        id: uuidv4(),
        title: 'Welcome to PreZenta',
        content: 'This is your first slide. Start editing!',
        elements: [
          { id: uuidv4(), type: 'heading', content: 'Welcome to PreZenta' },
          { id: uuidv4(), type: 'paragraph', content: 'This is your first slide. Start editing!' }
        ],
        layout: 'title',
        transition: 'slide',
        icon: 'RectangleHorizontal',
        notes: '',
        background: { color: '#ffffff', image: null, gradient: null },
      });
      setIsDefaultSlide(true);
    }
    
    setSlides(initialSlides);
    if(initialSlides.length > 0) {
        setSelectedSlide(initialSlides[0]);
    }
    setTitle(initialTitle);
    
    if (!presentationId) {
      const newId = uuidv4();
      setCurrentId(newId);
    } else {
      setCurrentId(presentationId);
    }
  }, [presentationId, isHistoryLoaded, outline, setSelectedTemplate, toast]);
  
  // Autosave presentation whenever slides, title, or template changes
  React.useEffect(() => {
      if (isInitialLoad.current) {
          isInitialLoad.current = false;
          return;
      }
      if (isDefaultSlide) {
          return;
      }
    
      if (currentId && selectedTemplate && slides.length > 0 && isHistoryLoaded) {
          autosavePresentation(currentId, title, slides);
      }
  }, [slides, title, selectedTemplate, layout, currentId, autosavePresentation, isHistoryLoaded, isDefaultSlide]);
  
  const handleSetSlides = (newSlides: React.SetStateAction<Slide[]>) => {
    setSlides(newSlides);
    if (isDefaultSlide) {
        setIsDefaultSlide(false);
    }
  }
  
  const handleSelectSlide = (slide: Slide) => {
    setSelectedSlide(slide);
  };
  
  const handleDeleteSlide = (slideId: string) => {
    if (slides.length <= 1) {
      toast({ title: "Cannot delete the last slide", variant: "destructive" });
      return;
    }
    const newSlides = slides.filter(s => s.id !== slideId);
    handleSetSlides(newSlides);
    if (selectedSlide?.id === slideId) {
      setSelectedSlide(newSlides[0]);
    }
  };
  
  const handleDuplicateSlide = (slide: Slide) => {
    const newSlide = {
      ...slide,
      id: uuidv4(),
      title: `${slide.title} (Copy)`,
    };
    const currentIndex = slides.findIndex(s => s.id === slide.id);
    const newSlides = [...slides];
    newSlides.splice(currentIndex + 1, 0, newSlide);
    handleSetSlides(newSlides);
    setSelectedSlide(newSlide);
  };
  
  const handleAddSlide = (layoutType: 'title' | 'content' | 'blank') => {
    const newSlide: Slide = {
      id: uuidv4(),
      title: 'New Slide',
      content: 'Add your content here.',
      elements: [],
      layout: layoutType,
      transition: 'slide',
      icon: 'RectangleHorizontal',
      notes: '',
      background: { color: '#ffffff', image: null, gradient: null },
    };
    const currentIndex = selectedSlide ? slides.findIndex(s => s.id === selectedSlide.id) : -1;
    const newSlides = [...slides];
    newSlides.splice(currentIndex + 1, 0, newSlide);
    handleSetSlides(newSlides);
    setSelectedSlide(newSlide);
  };
  
  const handleSlideChange = (updatedSlide: Slide) => {
    const newSlides = slides.map(s => s.id === updatedSlide.id ? updatedSlide : s);
    handleSetSlides(newSlides);
    setSelectedSlide(updatedSlide);
  };
  
  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
  }
  
  if (isPresenting) {
    return <PresentationView slides={slides} />;
  }
  
  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-background">
      {/* Hidden container for rendering full slides for uneditable PPTX */}
      <div style={{ position: 'fixed', left: '-9999px', top: '-9999px' }}>
        {slides.map((slide, index) => (
          <div 
            key={`${slide.id}-full`} 
            ref={el => { slidePreviewRefs.current[index] = el; }}
            style={{ width: `${layout.width}px`, height: `${layout.height}px` }}
          >
            <TemplateProvider>
              <SlideExportWrapper slide={slide} template={selectedTemplate} />
            </TemplateProvider>
          </div>
        ))}
      </div>
      
      {/* Hidden container for rendering background-only for editable PPTX */}
      <div style={{ position: 'fixed', left: '-9999px', top: '-9999px' }}>
        {slides.map((slide, index) => (
          <div
            key={`${slide.id}-bg`}
            ref={el => { bgPreviewRefs.current[index] = el; }}
            style={{ width: `${layout.width}px`, height: `${layout.height}px` }}
          >
            <TemplateProvider>
              <BgExportWrapper slide={slide} template={selectedTemplate} type={'bg-only'} />
            </TemplateProvider>
          </div>
        ))}
      </div>
      
      {/* Fixed Top Header */}
      <EditorHeader
        slides={slides}
        setSlides={handleSetSlides}
        initialTitle={title}
        onTitleChange={handleTitleChange}
        zoomLevel={zoomLevel}
        onZoomChange={setZoomLevel}
        onFitToScreen={fitToScreen}
        bgPreviewRefs={bgPreviewRefs}
        slidePreviewRefs={slidePreviewRefs}
        presentationTitle={title}
      />
      
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Left Sidebar (Slides Panel) - Compact */}
        <AnimatePresence>
          {isLeftSidebarOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 180, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="hidden md:flex flex-col h-full border-r bg-card relative"
            >
              <CompactSlideList
                slides={slides}
                selectedSlide={selectedSlide}
                onSelectSlide={handleSelectSlide}
                onDeleteSlide={handleDeleteSlide}
                onAddSlide={handleAddSlide}
                onDuplicateSlide={handleDuplicateSlide}
                toggleSidebar={() => setIsLeftSidebarOpen(false)}
              />
            </motion.aside>
          )}
        </AnimatePresence>
        
        {/* Main Workspace (Slide Canvas) */}
        <main
          ref={workspaceRef}
          className="flex-1 flex flex-col items-center justify-center overflow-auto relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800"
          onMouseDown={handleMouseDown}
        >
          {/* Pattern background - Make sure it doesn't block events */}
          <PatternBackground />
          
          {/* Zoom controls - Positioned above the slide */}
          <ZoomControls 
            zoomLevel={zoomLevel}
            setZoomLevel={setZoomLevel}
            resetZoom={() => setZoomLevel(1)}
          />
          
          {/* Zoom level indicator */}
          <ZoomLevelIndicator zoomLevel={zoomLevel} />
          
          {/* Slide container - Lower z-index to appear behind controls */}
          <div
            ref={contentRef}
            className="shadow-md origin-center bg-white z-10 rounded-lg"
            style={{
              width: `${layout.width}px`,
              height: `${layout.height}px`,
              transform: `scale(${zoomLevel}) translate(${pan.x}px, ${pan.y}px)`,
              transition: 'transform 0.2s ease-out',
            }}
          >
            <SlideView
              slide={selectedSlide}
            />
          </div>
        </main>
        
        {/* Left Sidebar Toggle - Only show when sidebar is closed and on desktop */}
        {!isLeftSidebarOpen && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsLeftSidebarOpen(true)}
            className="hidden md:flex fixed top-15 left-4 z-10 h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm shadow-lg"
          >
            <FilmIcon className="h-5 w-5" />
          </Button>
        )}
        
        {/* Right Sidebar Toggle (Desktop) - Only show when sidebar is closed */}
        {!isRightSidebarOpen && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsRightSidebarOpen(true)}
            className="hidden md:flex fixed top-15 right-4 z-10 h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm shadow-lg"
          >
            <PanelRight className="h-5 w-5" />
          </Button>
        )}
        
        {/* Right Sidebar Toggle (Mobile) */}
        <div className="md:hidden">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="fixed top-15 right-4 z-10 h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm shadow-lg">
                    <PanelRight className="h-5 w-5" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[260px] p-0 flex flex-col">
                    <SheetHeader className="p-3 border-b">
                    <SheetTitle className="text-base">Design & Layout</SheetTitle>
                    </SheetHeader>
                    <RightSidebarContent
                    selectedSlide={selectedSlide}
                    onSlideChange={handleSlideChange}
                    toggleSidebar={() => {}}
                    />
                </SheetContent>
            </Sheet>
        </div>
        
        {/* Right Sidebar (Desktop) */}
        <AnimatePresence>
            {isRightSidebarOpen && (
              <motion.aside
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 280, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="hidden md:flex flex-col border-l bg-card"
              >
                 <div className="p-3 border-b flex justify-between items-center">
                    <h3 className="text-base font-semibold">Design & Layout</h3>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6"
                      onClick={() => setIsRightSidebarOpen(false)}
                      title="Close sidebar"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                </div>
                <RightSidebarContent
                  selectedSlide={selectedSlide}
                  onSlideChange={handleSlideChange}
                  toggleSidebar={() => setIsRightSidebarOpen(false)}
                />
              </motion.aside>
            )}
        </AnimatePresence>
      </div>
      
      {/* Mobile Bottom Slide Strip */}
      <div className="md:hidden h-24 bg-card border-t">
        <EditorSlideStrip
          slides={slides}
          selectedSlide={selectedSlide}
          onSelectSlide={handleSelectSlide}
          onDeleteSlide={handleDeleteSlide}
          onAddSlide={handleAddSlide}
          onDuplicateSlide={handleDuplicateSlide}
        />
      </div>
    </div>
  );
}