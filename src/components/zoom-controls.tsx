'use client';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Minus, Plus, MonitorPlay } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface ZoomControlsProps {
  zoomLevel: number;
  setZoomLevel: (zoom: number) => void;
  resetZoom: () => void;
  variant?: 'default' | 'minimal';
}

export function ZoomControls({
  zoomLevel,
  setZoomLevel,
  resetZoom,
  variant = 'default',
}: ZoomControlsProps) {
  const handleZoom = (direction: 'in' | 'out') => {
    const change = direction === 'in' ? 0.1 : -0.1;
    setZoomLevel(Math.max(0.1, zoomLevel + change));
  };

  if (variant === 'minimal') {
    return (
      <div className="flex items-center gap-0.5">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-full"
          onClick={() => handleZoom('out')}
          aria-label="Zoom out"
        >
          <Minus className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-full"
          onClick={resetZoom}
          aria-label="Fit to screen"
        >
          <MonitorPlay className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-full"
          onClick={() => handleZoom('in')}
          aria-label="Zoom in"
        >
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 p-1 rounded-2xl bg-gradient-to-br from-background to-muted/30 backdrop-blur-sm border border-border/30 shadow-md"
    >
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-full"
        onClick={() => handleZoom('out')}
        aria-label="Zoom out"
      >
        <Minus className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-full"
        onClick={resetZoom}
        aria-label="Fit to screen"
      >
        <MonitorPlay className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-full"
        onClick={() => handleZoom('in')}
        aria-label="Zoom in"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </motion.div>
  );
}

interface ZoomLevelIndicatorProps {
  zoomLevel: number;
}

export function ZoomLevelIndicator({ zoomLevel }: ZoomLevelIndicatorProps) {
  const [visible, setVisible] = React.useState(false);
  const timeoutRef = React.useRef<NodeJS.Timeout>();

  React.useEffect(() => {
    setVisible(true);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setVisible(false), 1500);
    return () => clearTimeout(timeoutRef.current);
  }, [zoomLevel]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20"
        >
          <div className="px-3 py-1 text-xs font-mono rounded-full bg-background/80 backdrop-blur-sm shadow-md border border-border/30">
            {Math.round(zoomLevel * 100)}%
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
