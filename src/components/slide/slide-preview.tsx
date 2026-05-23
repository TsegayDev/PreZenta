
'use client';
import type { Slide, Template } from '@/lib/types';
import { useTemplate } from '@/hooks/use-template';
import React from 'react';
import { templates } from '@/lib/templates';
import { usePresentationSettings } from '@/hooks/use-presentation-settings';
import { getLayoutDesign, populateTemplate } from '@/lib/slide-layouts';
import { layoutDesigns } from '@/lib/layout-designs';
import DOMPurify from 'isomorphic-dompurify';

// Helper function to convert hex color to RGB format
function hexToRgb(hex: string): string {
  // Remove the hash if it's there
  hex = hex.replace(/^#/, '');
  
  // Parse the hex values
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  
  return `${r}, ${g}, ${b}`;
}

interface SlidePreviewProps {
  slide: Slide | null;
  template: Template | null;
  type:String | 'bg-only'
}

export function SlidePreview({ slide, template: templateOverride, type }: SlidePreviewProps) {
  const { selectedTemplate: contextTemplate } = useTemplate();
  const { layout: slideSize } = usePresentationSettings();
  
  const selectedTemplate = templateOverride || contextTemplate || templates[0];
  
  // Calculate RGB values for colors
  const primaryRgb = React.useMemo(() => {
    return selectedTemplate.colors.primaryRgb || hexToRgb(selectedTemplate.colors.primary);
  }, [selectedTemplate.colors.primary, selectedTemplate.colors.primaryRgb]);

  const accentRgb = React.useMemo(() => {
    return selectedTemplate.colors.accentRgb || hexToRgb(selectedTemplate.colors.accent);
  }, [selectedTemplate.colors.accent, selectedTemplate.colors.accentRgb]);
  
  if (!slide) {
    return <div className="w-full h-full bg-gray-200 flex items-center justify-center">No slide selected</div>;
  }
  
  const layoutDesign = getLayoutDesign(slide.layout);
  if (!layoutDesign) {
    return (
        <div className="w-full h-full bg-red-100 flex items-center justify-center text-red-800 p-4">
            Layout "{slide.layout}" not found.
        </div>
    );
  }
  
  const populatedHtml = populateTemplate(layoutDesign.html, slide);
  const sanitizedHtml = DOMPurify.sanitize(populatedHtml);
  
  const backgroundStyle: React.CSSProperties = {};
  let baseCss;
  if (type=='bg-only') {
   baseCss = layoutDesigns.bgCss;
  } else {
  baseCss = layoutDesigns.baseCss;
  }

  if (selectedTemplate.category === 'gradient') {
    backgroundStyle.background = selectedTemplate.background;
  } else if (selectedTemplate.category === 'pattern') {
    backgroundStyle.background = selectedTemplate.background;
    backgroundStyle.backgroundColor = selectedTemplate.colors.background;
    if (selectedTemplate.backgroundSize) {
      backgroundStyle.backgroundSize = selectedTemplate.backgroundSize;
    }
  } else { // Default to solid color
    backgroundStyle.backgroundColor = selectedTemplate.colors.background;
  }

  return (
    <div
      className="slide-bg-only relative w-full h-full overflow-hidden slide"
      style={{
        width: `${slideSize.width}px`,
        height: `${slideSize.height}px`,
        fontFamily: `var(--body-font)`,
        '--text': selectedTemplate.colors.text,
        '--heading': selectedTemplate.colors.heading,
        '--primary': selectedTemplate.colors.primary,
        '--accent': selectedTemplate.colors.accent,
        '--primary-light': selectedTemplate.colors.primaryLight || selectedTemplate.colors.primary,
        '--accent-light': selectedTemplate.colors.accentLight || selectedTemplate.colors.accent,
        '--primary-rgb': primaryRgb,
        '--accent-rgb': accentRgb,
        '--headline-font': selectedTemplate.font.headline,
        '--body-font': selectedTemplate.font.body,
        ...backgroundStyle,
      } as React.CSSProperties}
    >
      <style>{baseCss}</style>
      <style>{layoutDesign.css}</style>
      <div className='w-full h-full' dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
    </div>
  );
}
