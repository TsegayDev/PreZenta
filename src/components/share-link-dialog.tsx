
'use client';
import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Slide, Template } from '@/lib/types';
import {SlidePreview} from './slide/slide-preview';
import { usePresentationSettings } from '@/hooks/use-presentation-settings';

interface ShareLinkDialogProps {
  isOpen: boolean;
  onClose: () => void;
  presentationId: string | null;
  slide: Slide;
  template: Template | null;
}

export function ShareLinkDialog({ isOpen, onClose, presentationId, slide, template }: ShareLinkDialogProps) {
  const [hasCopied, setHasCopied] = React.useState(false);
  const { toast } = useToast();
  const [link, setLink] = React.useState('');
  const { layout: slideSize } = usePresentationSettings();

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setLink(`${window.location.origin}/generate-slide?id=${presentationId}`);
    }
  }, [presentationId]);

  const handleCopy = () => {
    navigator.clipboard.writeText(link);
    setHasCopied(true);
    toast({ title: 'Link copied to clipboard!' });
    setTimeout(() => setHasCopied(false), 2000);
  };
  
  const aspectRatio = slideSize.width / slideSize.height;
  const previewWidth = 300;
  const previewHeight = previewWidth / aspectRatio;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Presentation</DialogTitle>
          <DialogDescription>
            Anyone with this link can view this presentation.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
            <div 
              className="mx-auto rounded-lg overflow-hidden border shadow-sm"
              style={{ width: `${previewWidth}px`, height: `${previewHeight}px` }}
            >
                <div 
                  className="w-full h-full transform origin-top-left" 
                  style={{ transform: `scale(${previewWidth / slideSize.width})` }}
                >
                    <SlidePreview slide={slide} template={template}  type={'full'} />
                </div>
            </div>
            <div className="flex items-center space-x-2">
                <Input id="link" value={link} readOnly className="flex-1" />
                <Button type="button" size="icon" onClick={handleCopy}>
                {hasCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
            </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
