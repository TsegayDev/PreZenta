'use client';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Download,
  Share2,
  Play,
  Loader2,
  PanelLeft,
  PanelRight,
  PanelLeftClose,
  PanelRightClose,
  Monitor,
  Sparkles,
  FileText,
  Link,
  FileImage,
  FileLock2,
} from 'lucide-react';
import { useSlideEditor } from '@/hooks/use-slide-editor';
import { Logo } from '../logo';
import { useTemplate } from '@/hooks/use-template';
import type { Slide } from '@/lib/types';
import { generatePptx } from '@/lib/pptx-generator';
import { generateUneditablePptx } from '@/lib/pptx-image-generator';
import { useToast } from '@/hooks/use-toast';
import { TransitionSelector } from './transition-selector';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { usePresentationSettings } from '@/hooks/use-presentation-settings';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import * as htmlToImage from 'html-to-image';
import { templates } from '@/lib/templates';
import { ShareLinkDialog } from '../share-link-dialog';
import { ZoomControls, ZoomLevelIndicator } from '@/components/zoom-controls';

interface EditorHeaderProps {
  slides: Slide[];
  setSlides: React.Dispatch<React.SetStateAction<Slide[]>>;
  initialTitle: string;
  onTitleChange: (newTitle: string) => void;
  zoomLevel: number;
  onZoomChange: (zoom: number) => void;
  onFitToScreen: () => void;
  bgPreviewRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  slidePreviewRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  presentationTitle: string;
}

export function EditorHeader({
  slides,
  setSlides,
  initialTitle,
  onTitleChange,
  zoomLevel,
  onZoomChange,
  onFitToScreen,
  bgPreviewRefs,
  slidePreviewRefs,
  presentationTitle: propPresentationTitle,
}: EditorHeaderProps) {
  const { closeEditor, startPresentation, presentationId } = useSlideEditor();
  const { selectedTemplate } = useTemplate();
  const { layout } = usePresentationSettings();
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = React.useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = React.useState(false);
  const [presentationTitle, setPresentationTitle] = React.useState(initialTitle);
  const [isSavingTitle, setIsSavingTitle] = React.useState(false);

  React.useEffect(() => {
    setPresentationTitle(propPresentationTitle);
  }, [propPresentationTitle]);

  const handleDownloadEditable = async () => {
    if (!slides || slides.length === 0) {
      toast({
        title: 'Error',
        description: 'No slide content available to download.',
        variant: 'destructive',
      });
      return;
    }
    const templateToUse = selectedTemplate || templates[0];
    setIsDownloading(true);
    try {
      toast({
        title: 'Creating Presentation',
        description: 'Generating slide backgrounds...',
      });

      const backgroundImages = await Promise.all(
        bgPreviewRefs.current.map(async (ref) => {
          if (!ref) return '';
          return await htmlToImage.toPng(ref, {
            quality: 0.9,
            pixelRatio: 1,
            width: layout.width,
            height: layout.height,
          });
        }),
      );

      const validImages = backgroundImages.filter((img) => img);

      toast({
        title: 'Backgrounds Captured',
        description: 'Building the editable PPTX file...',
      });

      await generatePptx(
        validImages,
        slides,
        templateToUse,
        layout.name,
        presentationTitle,
      );
      toast({
        title: 'Download Complete!',
        description: 'Your presentation has been saved.',
      });
    } catch (error) {
      console.error('Failed to generate editable PPTX:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate presentation.',
        variant: 'destructive',
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadUneditable = async () => {
    if (!slides || slides.length === 0) {
      toast({
        title: 'Error',
        description: 'No slide content available to download.',
        variant: 'destructive',
      });
      return;
    }
    setIsDownloading(true);
    try {
      toast({
        title: 'Creating Presentation',
        description: 'Generating slide images...',
      });

      const slideImages = await Promise.all(
        slidePreviewRefs.current.map(async (ref) => {
          if (!ref) return '';
          return await htmlToImage.toPng(ref, {
            quality: 0.95,
            pixelRatio: 2, // Higher quality for image-based slides
            width: layout.width,
            height: layout.height,
          });
        }),
      );

      const validImages = slideImages.filter((img) => img);

      toast({
        title: 'Images Captured',
        description: 'Building the uneditable PPTX file...',
      });

      await generateUneditablePptx(
        validImages,
        layout.name,
        presentationTitle,
      );
      toast({
        title: 'Download Complete!',
        description: 'Your uneditable presentation has been saved.',
      });
    } catch (error) {
      console.error('Failed to generate uneditable PPTX:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate presentation.',
        variant: 'destructive',
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadPdf = () => {
    toast({
      title: 'Coming Soon!',
      description: 'PDF export is under development.',
    });
  };

  const handleShare = () => {
    setIsShareDialogOpen(true);
  };

  const handleTitleBlur = () => {
    if (initialTitle === presentationTitle) return;
    setIsSavingTitle(true);
    setTimeout(() => {
      onTitleChange(presentationTitle);
      setIsSavingTitle(false);
      toast({
        title: 'Renamed',
        description: `Presentation saved as "${presentationTitle}"`,
      });
    }, 750);
  };

  // Button variants with consistent styling
  const ActionButton = ({ children, ...props }: React.ComponentProps<typeof Button>) => (
    <Button
      size="sm"
      className={cn(
        'h-9 px-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-95',
      )}
      {...props}
    >
      {children}
    </Button>
  );

  return (
    <>
      <ShareLinkDialog
        isOpen={isShareDialogOpen}
        onClose={() => setIsShareDialogOpen(false)}
        presentationId={presentationId}
        slide={slides[0]}
        template={selectedTemplate}
      />

      <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between border-b bg-gradient-to-b from-background/95 to-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-2 sm:px-4 w-full shadow-sm">
        {/* Left Section */}
        <div className="flex items-center gap-2">
          <motion.button
            onClick={closeEditor}
            className="block cursor-pointer rounded-xl p-1 bg-gradient-to-br from-background to-muted/30 shadow-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Logo className="w-8 h-8" />
          </motion.button>
        </div>

        {/* Center Section */}
        <div className="flex flex-1 px-4 items-center justify-start gap-4 min-w-0">
          <div className="hidden sm:block relative w-full max-w-sm">
            <Input
              type="text"
              value={presentationTitle}
              onChange={(e) => setPresentationTitle(e.target.value)}
              onBlur={handleTitleBlur}
              className="w-full text-base font-semibold text-center bg-transparent border-none rounded-xl p-2 focus:bg-accent/30 focus:ring-2 focus:ring-primary/30 transition-all shadow-sm"
            />
            {isSavingTitle && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>Saving...</span>
              </div>
            )}
          </div>

          <div className="hidden md:flex items-center gap-1 p-1.5 rounded-2xl bg-gradient-to-br from-background to-muted/30 backdrop-blur-sm border border-border/30 shadow-sm">
            <ZoomControls
              zoomLevel={zoomLevel}
              setZoomLevel={onZoomChange}
              resetZoom={onFitToScreen}
              variant="minimal"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-20 text-sm font-mono rounded-xl hover:bg-accent/50 transition-colors flex items-center gap-1"
                >
                  <Monitor className="h-3 w-3" />
                  {Math.round(zoomLevel * 100)}%
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 rounded-xl border-border/50 shadow-lg"
              >
                <DropdownMenuItem onSelect={() => onZoomChange(0.5)} className="rounded-lg">
                  <div className="flex items-center justify-between w-full">
                    <span>50%</span>
                    <Badge variant="outline" className="text-xs rounded-md">
                      Small
                    </Badge>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => onZoomChange(1)} className="rounded-lg">
                  <div className="flex items-center justify-between w-full">
                    <span>100%</span>
                    <Badge variant="outline" className="text-xs rounded-md">
                      Actual Size
                    </Badge>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => onZoomChange(1.5)} className="rounded-lg">
                  <div className="flex items-center justify-between w-full">
                    <span>150%</span>
                    <Badge variant="outline" className="text-xs rounded-md">
                      Large
                    </Badge>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => onZoomChange(2)} className="rounded-lg">
                  <div className="flex items-center justify-between w-full">
                    <span>200%</span>
                    <Badge variant="outline" className="text-xs rounded-md">
                      Extra Large
                    </Badge>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={onFitToScreen} className="rounded-lg">
                  <div className="flex items-center gap-2">
                    <Monitor className="h-4 w-4" />
                    <span>Fit to Screen</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-1 sm:gap-2">
          <div className="block">
            <TransitionSelector slides={slides} setSlides={setSlides} />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <ActionButton
                variant="outline"
                className="rounded-full md:rounded bg-gradient-to-r from-background to-muted/50 hover:from-accent/20 hover:to-accent/10 border-border/50"
              >
                <Share2 className="h-4 w-4" />
                <span className="hidden sm:inline ml-2">Export</span>
              </ActionButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 rounded-xl border-border/50 shadow-lg"
            >
              <DropdownMenuItem onSelect={handleShare} className="rounded-lg cursor-pointer">
                <div className="flex items-center gap-2">
                  <Link className="h-4 w-4 text-blue-500" />
                  <span>Share Link</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={handleDownloadPdf} className="rounded-lg cursor-pointer">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-red-500" />
                  <span>Download PDF</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={handleDownloadEditable}
                disabled={isDownloading}
                className="rounded-lg cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  {isDownloading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-green-500" />
                  ) : (
                    <FileImage className="h-4 w-4 text-green-500" />
                  )}
                  <span>Editable PPTX</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={handleDownloadUneditable}
                disabled={isDownloading}
                className="rounded-lg cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  {isDownloading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-purple-500" />
                  ) : (
                    <FileLock2 className="h-4 w-4 text-purple-500" />
                  )}
                  <span>Uneditable PPTX</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <ActionButton
            onClick={startPresentation}
            className="rounded-full md:rounded bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-md hover:shadow-lg"
          >
            <Play className="h-4 w-4" />
            <span className="hidden sm:inline ml-2">Present</span>
          </ActionButton>
        </div>
      </header>
    </>
  );
}
