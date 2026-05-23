
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import useMeasure from 'react-use-measure';

const MIN_ZOOM = 0.1;
const MAX_ZOOM = 4;
const SCROLL_SENSITIVITY = 0.005;

/**
 * A hook to manage zoom and pan state for a workspace.
 */
export function useZoom() {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
  
  const [workspaceRef, { width: workspaceWidth, height: workspaceHeight }] = useMeasure();
  const contentRef = useRef<HTMLDivElement>(null);
  const pinchDistRef = useRef(0);

  const handleWheel = useCallback((event: WheelEvent) => {
    if (event.ctrlKey) {
      event.preventDefault();
      const delta = event.deltaY * -SCROLL_SENSITIVITY;
      setZoomLevel(prevZoom => 
        Math.min(Math.max(prevZoom + delta, MIN_ZOOM), MAX_ZOOM)
      );
    }
  }, []);

  const handleMouseDown = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget && event.button === 0) {
      setIsPanning(true);
      setStartPan({ x: event.clientX - pan.x, y: event.clientY - pan.y });
    }
  }, [pan.x, pan.y]);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (isPanning) {
        setPan({
            x: event.clientX - startPan.x,
            y: event.clientY - startPan.y,
        });
    }
  }, [isPanning, startPan]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  const handleTouchStart = useCallback((event: TouchEvent) => {
    if (event.touches.length === 1) {
      setIsPanning(true);
      setStartPan({ x: event.touches[0].clientX - pan.x, y: event.touches[0].clientY - pan.y });
    } else if (event.touches.length === 2) {
      const dx = event.touches[0].clientX - event.touches[1].clientX;
      const dy = event.touches[0].clientY - event.touches[1].clientY;
      pinchDistRef.current = Math.sqrt(dx * dx + dy * dy);
    }
  }, [pan.x, pan.y]);

  const handleTouchMove = useCallback((event: TouchEvent) => {
    if (event.touches.length === 1 && isPanning) {
      setPan({
        x: event.touches[0].clientX - startPan.x,
        y: event.touches[0].clientY - startPan.y,
      });
    } else if (event.touches.length === 2) {
      const dx = event.touches[0].clientX - event.touches[1].clientX;
      const dy = event.touches[0].clientY - event.touches[1].clientY;
      const newDist = Math.sqrt(dx * dx + dy * dy);
      const diff = newDist - pinchDistRef.current;
      
      setZoomLevel(prevZoom => Math.min(Math.max(prevZoom + diff * 0.01, MIN_ZOOM), MAX_ZOOM));
      pinchDistRef.current = newDist;
    }
  }, [isPanning, startPan]);

  const handleTouchEnd = useCallback(() => {
    setIsPanning(false);
    pinchDistRef.current = 0;
  }, []);

  useEffect(() => {
    const workspaceNode = (workspaceRef as unknown as { current: HTMLDivElement | null }).current;
    if (!workspaceNode) return;

    workspaceNode.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    workspaceNode.addEventListener('touchstart', handleTouchStart, { passive: true });
    workspaceNode.addEventListener('touchmove', handleTouchMove, { passive: true });
    workspaceNode.addEventListener('touchend', handleTouchEnd, { passive: true });
    workspaceNode.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    return () => {
      workspaceNode.removeEventListener('wheel', handleWheel);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      workspaceNode.removeEventListener('touchstart', handleTouchStart);
      workspaceNode.removeEventListener('touchmove', handleTouchMove);
      workspaceNode.removeEventListener('touchend', handleTouchEnd);
      workspaceNode.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [workspaceRef, handleWheel, handleMouseMove, handleMouseUp, handleTouchStart, handleTouchMove, handleTouchEnd]);

  const fitToScreen = useCallback(() => {
    setPan({ x: 0, y: 0 });
    if (!workspaceWidth || !workspaceHeight) return;

    const contentWidth = contentRef.current?.offsetWidth || 1920;
    const contentHeight = contentRef.current?.offsetHeight || 1080;
    
    if (contentWidth <= 0 || contentHeight <= 0) return;

    const scaleX = (workspaceWidth - 64) / contentWidth;
    const scaleY = (workspaceHeight - 64) / contentHeight;
    
    setZoomLevel(Math.min(scaleX, scaleY));
  }, [workspaceWidth, workspaceHeight]);
  
  useEffect(() => {
    fitToScreen();
    window.addEventListener('resize', fitToScreen);
    return () => window.removeEventListener('resize', fitToScreen);
  }, [fitToScreen]);


  return { zoomLevel, setZoomLevel, pan, workspaceRef, contentRef, fitToScreen, handleMouseDown };
}
