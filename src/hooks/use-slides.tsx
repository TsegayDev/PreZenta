
'use client';

import { createContext, useContext, useState, useMemo } from 'react';

interface SlidesContextType {
    numberOfSlides: number;
    setNumberOfSlides: (num: number) => void;
    outline: string | null;
    setOutline: (outline: string | null) => void;
}

const SlidesContext = createContext<SlidesContextType | undefined>(undefined);

export const SlidesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [numberOfSlides, setNumberOfSlides] = useState<number>(10);
    const [outline, setOutline] = useState<string | null>(null);

    const value = useMemo(() => ({
        numberOfSlides,
        setNumberOfSlides,
        outline,
        setOutline,
    }), [numberOfSlides, outline]);

    return (
        <SlidesContext.Provider value={value}>
            {children}
        </SlidesContext.Provider>
    );
};

export const useSlides = (): SlidesContextType => {
    const context = useContext(SlidesContext);
    if (context === undefined) {
        throw new Error('useSlides must be used within a SlidesProvider');
    }
    return context;
};
