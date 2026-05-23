
'use client';

import { cn } from '@/lib/utils';
import { usePageProgress } from '@/hooks/use-page-progress';

export function PageProgressBar() {
  const { progress, isVisible } = usePageProgress();

  return (
    <div
      className={cn(
        "page-progress-bar",
        isVisible ? "visible" : "hidden"
      )}
      style={{ width: `${progress}%` }}
    />
  );
}
