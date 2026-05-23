// src/components/ui/pattern-background.tsx
'use client';

import React from 'react';

// src/components/ui/pattern-background.tsx
export function PatternBackground() {
  return (
    <div className="absolute inset-0 z-0">
      <svg 
        width="100%" 
        height="100%" 
        xmlns="http://www.w3.org/2000/svg"
        className="pointer-events-none" // Add this to prevent blocking events
      >
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.2"/>
          </pattern>
          <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="currentColor" opacity="0.15"/>
            <circle cx="12" cy="12" r="1" fill="currentColor" opacity="0.15"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        <rect width="100%" height="100%" fill="url(#dots)" />
      </svg>
    </div>
  );
}