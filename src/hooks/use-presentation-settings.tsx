
'use client';

import { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import type { PptxLayout, TextAmount, ImageSource } from '@/lib/types';

interface PresentationSettingsContextType {
  layout: {
    name: PptxLayout,
    width: number;
    height: number;
  };
  setLayout: (layout: { name: PptxLayout, width: number, height: number }) => void;
  textAmount: TextAmount;
  setTextAmount: (amount: TextAmount) => void;
  imageSource: ImageSource;
  setImageSource: (source: ImageSource) => void;
}

const PresentationSettingsContext = createContext<PresentationSettingsContextType | undefined>(undefined);

export const PresentationSettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [layout, setLayout] = useState<{ name: PptxLayout, width: number, height: number }>({ name: 'LAYOUT_16x9', width: 1920, height: 1080 });
    const [textAmount, setTextAmount] = useState<TextAmount>('extensive');
    const [imageSource, setImageSource] = useState<ImageSource>('automatic');

    const value = useMemo(() => ({
        layout,
        setLayout,
        textAmount,
        setTextAmount,
        imageSource,
        setImageSource,
    }), [layout, textAmount, imageSource]);

    return (
        <PresentationSettingsContext.Provider value={value}>
            {children}
        </PresentationSettingsContext.Provider>
    );
};

export const usePresentationSettings = (): PresentationSettingsContextType => {
    const context = useContext(PresentationSettingsContext);
    if (context === undefined) {
        throw new Error('usePresentationSettings must be used within a PresentationSettingsProvider');
    }
    return context;
};
