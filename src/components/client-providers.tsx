"use client"
import React from 'react';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from 'next-themes';
import { SlidesProvider } from '@/hooks/use-slides';
import { TemplateProvider } from '@/hooks/use-template';
import { PresentationSettingsProvider } from '@/hooks/use-presentation-settings';
import { PresentationHistoryProvider } from '@/hooks/use-presentation-history';
import { ChatProvider } from '@/hooks/use-chat';
import { SlideEditorProvider } from '@/hooks/use-slide-editor';
import { PageProgressBar } from '@/components/ui/page-progress-bar';
import { ProgressBarProvider } from '@/hooks/use-page-progress';

type Props = {
  children: React.ReactNode;
};

export default function ClientProviders({ children }: Props) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ProgressBarProvider>
        <PresentationSettingsProvider>
          <TemplateProvider>
            <SlidesProvider>
              <ChatProvider>
                <PresentationHistoryProvider>
                  <SlideEditorProvider>
                    <PageProgressBar />
                    {children}
                    <Toaster />
                  </SlideEditorProvider>
                </PresentationHistoryProvider>
              </ChatProvider>
            </SlidesProvider>
          </TemplateProvider>
        </PresentationSettingsProvider>
      </ProgressBarProvider>
    </ThemeProvider>
  );
}
