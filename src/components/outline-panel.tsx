
'use client';

import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Lightbulb,
} from 'lucide-react';

interface OutlinePanelProps {
  onDownload: () => void;
}

export function OutlinePanel({
  onDownload,
}: OutlinePanelProps) {

  return (
    <div className="space-y-6">
      <Alert>
        <Lightbulb className="h-4 w-4" />
        <AlertTitle>AI Assistance</AlertTitle>
        <AlertDescription>
          Our AI provides suggestions, but final content should always be reviewed for accuracy and tone.
        </AlertDescription>
      </Alert>
    </div>
  );
}
