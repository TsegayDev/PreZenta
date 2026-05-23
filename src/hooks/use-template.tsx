
'use client';

import { createContext, useContext, useState, useMemo, useCallback } from 'react';
import type { Template } from '@/lib/types';
import { templates } from '@/lib/templates';

interface TemplateContextType {
  templates: Template[];
  selectedTemplate: Template | null;
  setSelectedTemplate: (template: Template | null) => void;
}

const TemplateContext = createContext<TemplateContextType | undefined>(
  undefined,
);

export const TemplateProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedTemplate, setSelectedTemplateState] = useState<Template | null>(
    templates[0],
  );

  const setSelectedTemplate = useCallback((template: Template | null) => {
    setSelectedTemplateState(template);
  }, []);

  const value = useMemo(
    () => ({
      templates,
      selectedTemplate,
      setSelectedTemplate,
    }),
    [selectedTemplate, setSelectedTemplate],
  );

  return (
    <TemplateContext.Provider value={value}>{children}</TemplateContext.Provider>
  );
};

export const useTemplate = (): TemplateContextType => {
  const context = useContext(TemplateContext);
  if (context === undefined) {
    throw new Error('useTemplate must be used within a TemplateProvider');
  }
  return context;
};
