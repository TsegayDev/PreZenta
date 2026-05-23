
'use client';

import { createContext, useContext, useState, useMemo, useEffect, useCallback, ReactNode } from 'react';
import type { PresentationHistoryItem } from '@/lib/types';

interface PresentationHistoryContextType {
  history: PresentationHistoryItem[];
  isHistoryLoaded: boolean;
  addPresentationHistory: (item: PresentationHistoryItem) => void;
  updatePresentationHistory: (id: string, updates: Partial<PresentationHistoryItem>) => void;
  removePresentationHistory: (id: string) => void;
  clearAllHistory: () => void;
}

const PresentationHistoryContext = createContext<PresentationHistoryContextType | undefined>(undefined);

const STORAGE_KEY = 'prezenta_presentation_history';

export const PresentationHistoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [history, setHistory] = useState<PresentationHistoryItem[]>([]);
    const [isHistoryLoaded, setIsHistoryLoaded] = useState(false);

    useEffect(() => {
        try {
            const savedHistory = localStorage.getItem(STORAGE_KEY);
            if (savedHistory) {
                setHistory(JSON.parse(savedHistory));
            }
        } catch (error) {
            console.error("Failed to load presentation history from local storage", error);
        } finally {
            setIsHistoryLoaded(true);
        }
    }, []);

    // Effect to save history to localStorage whenever it changes
    useEffect(() => {
        if (isHistoryLoaded) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
        }
    }, [history, isHistoryLoaded]);

    const addPresentationHistory = useCallback((item: PresentationHistoryItem) => {
        setHistory(prev => {
            const newHistory = [item, ...prev.filter(p => p.id !== item.id)];
            return newHistory.sort((a, b) => b.timestamp - a.timestamp);
        });
    }, []);

    const updatePresentationHistory = useCallback((id: string, updates: Partial<PresentationHistoryItem>) => {
        setHistory(prev => 
            prev.map(item =>
                item.id === id ? { ...item, ...updates, timestamp: Date.now() } : item
            ).sort((a, b) => b.timestamp - a.timestamp) // Keep list sorted
        );
    }, []);

    const removePresentationHistory = useCallback((id: string) => {
        setHistory(prev => prev.filter(item => item.id !== id));
    }, []);

    const clearAllHistory = useCallback(() => {
        setHistory([]);
    }, []);

    const value = useMemo(() => ({
        history,
        isHistoryLoaded,
        addPresentationHistory,
        updatePresentationHistory,
        removePresentationHistory,
        clearAllHistory,
    }), [history, isHistoryLoaded, addPresentationHistory, updatePresentationHistory, removePresentationHistory, clearAllHistory]);

    return (
        <PresentationHistoryContext.Provider value={value}>
            {children}
        </PresentationHistoryContext.Provider>
    );
};

export const usePresentationHistory = (): PresentationHistoryContextType => {
    const context = useContext(PresentationHistoryContext);
    if (context === undefined) {
        throw new Error('usePresentationHistory must be used within a PresentationHistoryProvider');
    }
    return context;
};

    