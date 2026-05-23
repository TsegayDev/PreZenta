'use client';
import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  ChevronLeft, ChevronRight, X, ArrowLeftToLine, ArrowRightToLine, 
  Home, Clock, Grid3x3, Pause, Play, Volume2, VolumeX, Maximize, Minimize
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SlideView } from '@/components/slide/slide-view';
import { useSlideEditor } from '@/hooks/use-slide-editor';
import { usePresentationSettings } from '@/hooks/use-presentation-settings';
import type { Slide, TransitionType } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { useTimer } from '@/hooks/use-timer';
import { useSwipeable } from 'react-swipeable';

// Animation variants with more options
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
  }),
};

const fadeVariants = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 },
};

const zoomVariants = {
  enter: { scale: 0.8, opacity: 0 },
  center: { scale: 1, opacity: 1 },
  exit: { scale: 0.8, opacity: 0 },
};

const scaleVariants = {
  enter: { scale: 1.1, opacity: 0 },
  center: { scale: 1, opacity: 1 },
  exit: { scale: 0.9, opacity: 0 },
};

const flipVariants = {
  enter: { rotateY: 90, opacity: 0 },
  center: { rotateY: 0, opacity: 1 },
  exit: { rotateY: -90, opacity: 0 },
};

const noneVariants = {
  enter: { opacity: 1 },
  center: { opacity: 1 },
  exit: { opacity: 1 },
};

// Enhanced transition map with more options
const transitionMap = {
  slide: { 
    variants: slideVariants, 
    transition: { 
      x: { type: 'spring', stiffness: 300, damping: 30 }, 
      opacity: { duration: 0.2 } 
    } 
  },
  fade: { 
    variants: fadeVariants, 
    transition: { 
      opacity: { duration: 0.5, ease: 'easeInOut' } 
    } 
  },
  zoom: { 
    variants: zoomVariants, 
    transition: { 
      duration: 0.4, ease: 'easeOut' 
    } 
  },
  scale: { 
    variants: scaleVariants, 
    transition: { 
      duration: 0.4, ease: 'easeOut' } 
  },
  flip: { 
    variants: flipVariants, 
    transition: { 
      duration: 0.6, ease: 'easeInOut' 
    } 
  },
  none: { 
    variants: noneVariants, 
    transition: { 
      duration: 0 
    } 
  },
};

// Slide Grid Component for quick navigation
const SlideGrid = ({ 
  slides, 
  currentIndex, 
  goToSlide, 
  onClose 
}: { 
  slides: Slide[]; 
  currentIndex: number; 
  goToSlide: (index: number) => void; 
  onClose: () => void;
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex flex-col">
      <div className="p-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Slide Grid</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="rounded-full text-white/70 hover:text-white hover:bg-white/10"
        >
          <X className="h-6 w-6" />
        </Button>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={cn(
                "relative aspect-video rounded-md overflow-hidden cursor-pointer border-2 transition-all",
                index === currentIndex 
                  ? "border-white scale-105" 
                  : "border-transparent hover:border-white/50"
              )}
              onClick={() => goToSlide(index)}
            >
              <SlideView slide={slide} />
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-2">
                {slide.title || `Slide ${index + 1}`}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Speaker Notes Component
const SpeakerNotes = ({ notes }: { notes?: string }) => {
  if (!notes) return null;
  
  return (
    <div className="absolute bottom-16 left-4 right-4 bg-black/80 backdrop-blur-sm text-white p-4 rounded-lg max-h-40 overflow-auto">
      <h3 className="font-semibold mb-2">Speaker Notes:</h3>
      <p className="text-sm">{notes}</p>
    </div>
  );
};

// Main Presentation View Component
export function PresentationView({ slides }: { slides: Slide[] }) {
  const { stopPresentation } = useSlideEditor();
  const { layout: slideSize } = usePresentationSettings();
  const [[page, direction], setPage] = React.useState([0, 0]);
  const [isControlsVisible, setIsControlsVisible] = React.useState(true);
  const controlsTimeoutRef = React.useRef<NodeJS.Timeout>();
  const [isAutoPlaying, setIsAutoPlaying] = React.useState(false);
  const autoPlayIntervalRef = React.useRef<NodeJS.Timeout>();
  const [autoPlaySpeed, setAutoPlaySpeed] = React.useState(5000); // Default 5 seconds
  const { time, startTimer, pauseTimer, resetTimer } = useTimer();
  const [showTimer, setShowTimer] = React.useState(false);
  const [showSlideGrid, setShowSlideGrid] = React.useState(false);
  const [showSpeakerNotes, setShowSpeakerNotes] = React.useState(false);
  const [isMuted, setIsMuted] = React.useState(false);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [zoomLevel, setZoomLevel] = React.useState(1);
  
  // Format time as MM:SS
  const formattedTime = `${Math.floor(time / 60)
    .toString()
    .padStart(2, '0')}:${(time % 60).toString().padStart(2, '0')}`;

  // Swipe handlers for touch devices
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => paginate(1),
    onSwipedRight: () => paginate(-1),
    preventDefaultTouchmoveEvent: true,
    trackMouse: false
  });

  // Navigate to a specific slide
  const goToSlide = (index: number) => {
    const newDirection = index > page ? 1 : -1;
    setPage([index, newDirection]);
    resetControlsTimeout();
    setShowSlideGrid(false);
  };

  // Pagination with wrap-around
  const paginate = (newDirection: number) => {
    let newIndex = page + newDirection;
    if (newIndex < 0) {
      newIndex = slides.length - 1;
    } else if (newIndex >= slides.length) {
      newIndex = 0;
    }
    setPage([newIndex, newDirection]);
    resetControlsTimeout();
  };

  // Navigation to first and last slides
  const goToFirstSlide = () => {
    setPage([0, -1]);
    resetControlsTimeout();
  };

  const goToLastSlide = () => {
    setPage([slides.length - 1, 1]);
    resetControlsTimeout();
  };

  // Auto-play functionality
  const toggleAutoPlay = () => {
    if (isAutoPlaying) {
      clearInterval(autoPlayIntervalRef.current);
      pauseTimer();
    } else {
      autoPlayIntervalRef.current = setInterval(() => {
        paginate(1);
      }, autoPlaySpeed);
      startTimer();
    }
    setIsAutoPlaying(!isAutoPlaying);
    resetControlsTimeout();
  };

  // Change auto-play speed
  const changeAutoPlaySpeed = (speed: number) => {
    setAutoPlaySpeed(speed);
    if (isAutoPlaying) {
      clearInterval(autoPlayIntervalRef.current);
      autoPlayIntervalRef.current = setInterval(() => {
        paginate(1);
      }, speed);
    }
    resetControlsTimeout();
  };

  // Reset controls visibility timeout
  const resetControlsTimeout = () => {
    setIsControlsVisible(true);
    clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      setIsControlsVisible(false);
    }, 3000); // Hide controls after 3 seconds of inactivity
  };

  // Toggle timer visibility
  const toggleTimerVisibility = () => {
    setShowTimer(!showTimer);
    resetControlsTimeout();
  };

  // Toggle speaker notes
  const toggleSpeakerNotes = () => {
    setShowSpeakerNotes(!showSpeakerNotes);
    resetControlsTimeout();
  };

  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
    resetControlsTimeout();
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
    resetControlsTimeout();
  };

  // Zoom controls
  const zoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.1, 2));
    resetControlsTimeout();
  };

  const zoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.1, 0.5));
    resetControlsTimeout();
  };

  const resetZoom = () => {
    setZoomLevel(1);
    resetControlsTimeout();
  };

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default for presentation keys
      if (['ArrowRight', 'ArrowLeft', ' ', 'PageDown', 'PageUp', 'Home', 'End', 'Escape', 't', 'a', 'g', 's', 'f', 'm', '+', '-', '0'].includes(e.key)) {
        e.preventDefault();
      }
      
      switch (e.key) {
        case 'ArrowRight':
        case ' ':
        case 'PageDown':
          paginate(1);
          break;
        case 'ArrowLeft':
        case 'PageUp':
          paginate(-1);
          break;
        case 'Home':
          goToFirstSlide();
          break;
        case 'End':
          goToLastSlide();
          break;
        case 'Escape':
          if (showSlideGrid) {
            setShowSlideGrid(false);
          } else {
            stopPresentation();
          }
          break;
        case 't':
          toggleTimerVisibility();
          break;
        case 'a':
          toggleAutoPlay();
          break;
        case 'g':
          setShowSlideGrid(!showSlideGrid);
          break;
        case 's':
          toggleSpeakerNotes();
          break;
        case 'f':
          toggleFullscreen();
          break;
        case 'm':
          toggleMute();
          break;
        case '+':
        case '=':
          zoomIn();
          break;
        case '-':
        case '_':
          zoomOut();
          break;
        case '0':
          resetZoom();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    resetControlsTimeout();
    startTimer();
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(controlsTimeoutRef.current);
      clearInterval(autoPlayIntervalRef.current);
      pauseTimer();
    };
  }, [page, isAutoPlaying, showSlideGrid]);

  // Handle fullscreen change
  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Get current slide and transition
  const currentSlide = slides[page];
  const transitionType = currentSlide?.transition || 'slide';
  const { variants, transition } = transitionMap[transitionType as TransitionType] || transitionMap.slide;

  // If slide grid is shown, render it instead of the presentation
  if (showSlideGrid) {
    return (
      <SlideGrid
        slides={slides}
        currentIndex={page}
        goToSlide={goToSlide}
        onClose={() => setShowSlideGrid(false)}
      />
    );
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex h-screen w-screen flex-col items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={resetControlsTimeout}
      {...swipeHandlers}
      role="presentation"
      aria-label="Slide presentation"
    >
      {/* Header Controls */}
      <div 
        className={cn(
          "absolute top-0 left-0 right-0 p-4 flex justify-between items-center transition-opacity duration-300",
          isControlsVisible ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        aria-hidden={!isControlsVisible}
      >
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={stopPresentation}
            className="rounded-full text-white/70 hover:text-white hover:bg-white/10"
            aria-label="Exit presentation"
          >
            <X className="h-6 w-6" />
          </Button>
          {showTimer && (
            <Button
              variant="ghost"
              size="sm"
              className="text-white/70 hover:text-white hover:bg-white/10 gap-2"
              aria-label={`Presentation time: ${formattedTime}`}
            >
              <Clock className="h-4 w-4" />
              {formattedTime}
            </Button>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleFullscreen}
            className="rounded-full text-white/70 hover:text-white hover:bg-white/10"
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMute}
            className={cn(
              "rounded-full text-white/70 hover:text-white hover:bg-white/10",
              isMuted && "text-white bg-white/20"
            )}
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleAutoPlay}
            className={cn(
              "text-white/70 hover:text-white hover:bg-white/10",
              isAutoPlaying && "text-white bg-white/20"
            )}
            aria-label={isAutoPlaying ? "Pause autoplay" : "Start autoplay"}
          >
            {isAutoPlaying ? <Pause className="h-4 w-4 mr-1" /> : <Play className="h-4 w-4 mr-1" />}
            {isAutoPlaying ? 'Pause' : 'Auto Play'}
          </Button>
          {isAutoPlaying && (
            <div className="flex items-center space-x-1 bg-white/10 rounded-md p-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => changeAutoPlaySpeed(3000)}
                className={cn(
                  "text-xs h-6 px-2",
                  autoPlaySpeed === 3000 && "bg-white/20 text-white"
                )}
              >
                Fast
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => changeAutoPlaySpeed(5000)}
                className={cn(
                  "text-xs h-6 px-2",
                  autoPlaySpeed === 5000 && "bg-white/20 text-white"
                )}
              >
                Normal
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => changeAutoPlaySpeed(10000)}
                className={cn(
                  "text-xs h-6 px-2",
                  autoPlaySpeed === 10000 && "bg-white/20 text-white"
                )}
              >
                Slow
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Slide Content */}
      <div className="relative h-full w-full max-w-7xl flex items-center justify-center overflow-hidden">
        <AnimatePresence initial={false} custom={direction}>
          {currentSlide && (
            <motion.div
              key={page}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={transition}
              className="absolute flex items-center justify-center"
              style={{ 
                width: '100%', 
                height: '100%',
                maxWidth: `${slideSize.width}px`,
                maxHeight: `${slideSize.height}px`
              }}
            >
              <div style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center' }}>
                <SlideView slide={currentSlide} isMuted={isMuted} />
              </div>
              {showSpeakerNotes && <SpeakerNotes notes={currentSlide.speakerNotes} />}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      <div className={cn(
        "absolute inset-0 flex items-center justify-between p-4 transition-opacity duration-300",
        isControlsVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
      aria-hidden={!isControlsVisible}>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={goToFirstSlide}
            className="rounded-full h-12 w-12 text-white/70 hover:text-white hover:bg-white/10"
            aria-label="Go to first slide"
          >
            <ArrowLeftToLine className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => paginate(-1)}
            className="rounded-full h-12 w-12 text-white/70 hover:text-white hover:bg-white/10"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => paginate(1)}
            className="rounded-full h-12 w-12 text-white/70 hover:text-white hover:bg-white/10"
            aria-label="Next slide"
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={goToLastSlide}
            className="rounded-full h-12 w-12 text-white/70 hover:text-white hover:bg-white/10"
            aria-label="Go to last slide"
          >
            <ArrowRightToLine className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Footer Controls */}
      <div 
        className={cn(
          "absolute bottom-0 left-0 right-0 p-4 transition-opacity duration-300",
          isControlsVisible ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        aria-hidden={!isControlsVisible}
      >
        <div className="flex items-center justify-between">
          <div className="text-sm text-white/70">
            {currentSlide?.title || `Slide ${page + 1}`}
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-white/70">
              {page + 1} / {slides.length}
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={zoomOut}
                className="rounded-full h-8 w-8 text-white/70 hover:text-white hover:bg-white/10"
                aria-label="Zoom out"
                disabled={zoomLevel <= 0.5}
              >
                <span className="text-lg">-</span>
              </Button>
              <span className="text-xs text-white/70 w-10 text-center">
                {Math.round(zoomLevel * 100)}%
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={zoomIn}
                className="rounded-full h-8 w-8 text-white/70 hover:text-white hover:bg-white/10"
                aria-label="Zoom in"
                disabled={zoomLevel >= 2}
              >
                <span className="text-lg">+</span>
              </Button>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSpeakerNotes}
              className={cn(
                "rounded-full text-white/70 hover:text-white hover:bg-white/10",
                showSpeakerNotes && "text-white bg-white/20"
              )}
              aria-label={showSpeakerNotes ? "Hide speaker notes" : "Show speaker notes"}
            >
              <span className="text-sm font-mono">S</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTimerVisibility}
              className={cn(
                "rounded-full text-white/70 hover:text-white hover:bg-white/10",
                showTimer && "text-white bg-white/20"
              )}
              aria-label={showTimer ? "Hide timer" : "Show timer"}
            >
              <Clock className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSlideGrid(true)}
              className="rounded-full text-white/70 hover:text-white hover:bg-white/10"
              aria-label="Show slide grid"
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Progress 
          value={((page + 1) / slides.length) * 100} 
          className="h-1 mt-2 bg-white/10" 
          indicatorClassName="bg-white/70"
          aria-label={`Progress: ${page + 1} of ${slides.length} slides`}
        />
      </div>

      {/* Help Overlay */}
      {isControlsVisible && (
        <div className="absolute bottom-20 right-4 bg-black/70 text-white text-xs p-2 rounded-md max-w-xs">
          <div className="font-semibold mb-1">Keyboard Shortcuts:</div>
          <div className="grid grid-cols-2 gap-1">
            <div>←/→ or Space:</div><div>Previous/Next</div>
            <div>Home/End:</div><div>First/Last slide</div>
            <div>G:</div><div>Slide grid</div>
            <div>S:</div><div>Speaker notes</div>
            <div>A:</div><div>Auto play</div>
            <div>T:</div><div>Timer</div>
            <div>F:</div><div>Fullscreen</div>
            <div>M:</div><div>Mute</div>
            <div>+/-:</div><div>Zoom</div>
            <div>0:</div><div>Reset zoom</div>
            <div>Esc:</div><div>Exit</div>
          </div>
        </div>
      )}
    </div>
  );
}