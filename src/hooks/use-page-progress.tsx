
'use client';

import { createContext, useContext, useState, useMemo, useCallback, ReactNode, useRef } from 'react';

interface ProgressBarContextType {
  progress: number;
  isVisible: boolean;
  start: () => void;
  finish: () => void;
}

const ProgressBarContext = createContext<ProgressBarContextType | undefined>(undefined);

export const ProgressBarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [progress, setProgress] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const start = useCallback(() => {
        setIsVisible(true);
        setProgress(10); // Initial jump

        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
        
        progressIntervalRef.current = setInterval(() => {
            setProgress(prev => {
                if (prev >= 95) {
                    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
                    return prev;
                }
                // Animate slowly to 95%
                let diff = 0;
                if (prev >= 0 && prev < 20) diff = 10;
                else if (prev >= 20 && prev < 50) diff = 4;
                else diff = 2;

                return Math.min(prev + diff, 95);
            });
        }, 100);
    }, []);

    const finish = useCallback(() => {
        if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
            progressIntervalRef.current = null;
        }
        
        if (isVisible) {
            setProgress(100);
            setTimeout(() => {
                setIsVisible(false);
                // Reset progress after fade out
                setTimeout(() => {
                    setProgress(0);
                }, 500);
            }, 500);
        }
    }, [isVisible]);

    const value = useMemo(() => ({
        progress,
        isVisible,
        start,
        finish,
    }), [progress, isVisible, start, finish]);

    return (
        <ProgressBarContext.Provider value={value}>
            {children}
        </ProgressBarContext.Provider>
    );
};

export const usePageProgress = (): ProgressBarContextType => {
    const context = useContext(ProgressBarContext);
    if (context === undefined) {
        throw new Error('usePageProgress must be used within a ProgressBarProvider');
    }
    return context;
};
