
'use client';

import { createContext, useContext, useState, useMemo, ReactNode, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { usePresentationHistory } from './use-presentation-history';
import { useTemplate } from './use-template';
import { usePresentationSettings } from './use-presentation-settings';
import { parseOutline } from '@/lib/parser';
import { templates } from '@/lib/templates';
import type { Slide } from '@/lib/types';
import { usePageProgress } from './use-page-progress';

interface SlideEditorContextType {
  isEditorOpen: boolean;
  outline: string | null;
  presentationId: string | null;
  openEditor: (outline: string, id?: string) => void;
  closeEditor: () => void;
  isPresenting: boolean;
  startPresentation: () => void;
  stopPresentation: () => void;
  autosavePresentation: (id: string, title: string, slides: Slide[]) => void;
}

const SlideEditorContext = createContext<SlideEditorContextType | undefined>(undefined);

export const SlideEditorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const idFromUrl = searchParams.get('id');

    const [isEditorOpen, setIsEditorOpen] = useState<boolean>(!!idFromUrl);
    const [outline, setOutline] = useState<string | null>(null);
    const [presentationId, setPresentationId] = useState<string | null>(idFromUrl);
    const [isPresenting, setIsPresenting] = useState<boolean>(false);
    
    const { addPresentationHistory, updatePresentationHistory } = usePresentationHistory();
    const { selectedTemplate } = useTemplate();
    const { layout } = usePresentationSettings();
    const { start: startProgress } = usePageProgress();

    const openEditor = useCallback((newOutline: string, id?: string) => {
        startProgress();
        const newId = id || uuidv4();
        setPresentationId(newId);
        setOutline(newOutline);

        // Create a new history entry only if it's a new presentation
        if (!id) {
            const initialSlides = parseOutline(newOutline);
            const initialTitle = initialSlides.length > 0 ? initialSlides[0].title : 'New Presentation';
            const templateId = selectedTemplate?.id || templates[0].id;
            
            addPresentationHistory({
                id: newId,
                title: initialTitle,
                detailedContent: JSON.stringify(initialSlides),
                templateId: templateId,
                layout: layout,
                timestamp: Date.now(),
            });
        }
        
        router.push(`/generate-slide?id=${newId}`);
        setIsEditorOpen(true);
    }, [addPresentationHistory, layout, router, selectedTemplate, startProgress]);

    const closeEditor = useCallback(() => {
        startProgress();
        setIsEditorOpen(false);
        setIsPresenting(false);
        router.push('/');
        setTimeout(() => {
            setOutline(null);
            setPresentationId(null);
        }, 300);
    }, [router, startProgress]);

    const startPresentation = () => setIsPresenting(true);
    const stopPresentation = () => setIsPresenting(false);

    const autosavePresentation = useCallback((id: string, title: string, slides: Slide[]) => {
        if (!selectedTemplate) return;
        
        const presentationData = {
            title,
            detailedContent: JSON.stringify(slides),
            templateId: selectedTemplate.id,
            layout: layout,
        };
        updatePresentationHistory(id, presentationData);
    }, [layout, selectedTemplate, updatePresentationHistory]);


    const value = useMemo(() => ({
        isEditorOpen,
        outline,
        presentationId,
        openEditor,
        closeEditor,
        isPresenting,
        startPresentation,
        stopPresentation,
        autosavePresentation,
    }), [isEditorOpen, outline, presentationId, openEditor, closeEditor, isPresenting, autosavePresentation]);

    return (
        <SlideEditorContext.Provider value={value}>
            {children}
        </SlideEditorContext.Provider>
    );
};

export const useSlideEditor = (): SlideEditorContextType => {
    const context = useContext(SlideEditorContext);
    if (context === undefined) {
        throw new Error('useSlideEditor must be used within a SlideEditorProvider');
    }
    return context;
};
