import type React from 'react';

// User & Auth
export interface AppUser {
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  plan: 'Free' | 'Pro' | 'Unlimited';
  tokens: number;
}

// AI & Chat
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  status: 'loading' | 'streaming' | 'complete' | 'failed';
  timestamp: number;
  type?: 'text' | 'outline';
  retryData?: {
    action: 'resend' | 'improve';
    request: any;
    originalMessageId?: string;
  };
}

export interface Chat {
  id: string;
  title: string;
  createdAt: number;
  messages: Message[];
}

export interface AIModel {
  id: string;
  name: string;
  provider: 'Google' | 'OpenAI' | 'Other';
}

// Presentation & Slides
export type TransitionType = 'slide' | 'fade' | 'zoom' | 'none' | 'scale';

export type SlideLayout =
  | 'title'
  | 'content'
  | 'two-column'
  | 'two-column-headed'
  | 'three-column'
  | 'three-column-headed'
  | 'four-column'
  | 'image-right'
  | 'image-left'
  | 'title-bullets'
  | 'title-bullets-image'
  | 'quote'
  | 'blank'
  | 'comparison'
  | 'code'
  | 'accent-left'
  | 'accent-right'
  | 'accent-top'
  | 'accent-right-fit'
  | 'accent-left-fit'
  | 'accent-background'
  | 'two-image-columns'
  | 'three-image-columns'
  | 'four-image-columns'
  | 'images-with-text'
  | 'image-gallery'
  | 'team-photos'
  | 'data-chart'
  | 'timeline'
  | 'process-flow'
  | 'section-header';

export interface SlideElement {
  id: string;
  type: 'heading' | 'paragraph' | 'list' | 'image' | 'quote' | 'shape';
  content: string;
  src?: string;
  alt?: string;
  position?: { x: number; y: number };
  size?: { width: number; height: number };
  rotation?: number;
  opacity?: number;
  zIndex?: number;
  locked?: boolean;
  background?: { color?: string; image?: string; gradient?: string };
  fontStyle?: {
    family?: string;
    size?: number;
    color?: string;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    align?: 'left' | 'center' | 'right' | 'justify';
  };
}

export interface Slide {
  id: string;
  title: string;
  content: string;
  elements: SlideElement[];
  layout: SlideLayout;
  transition: TransitionType;
  icon?: string;
  image?: string;
  notes?: string;
  background?: {
    color: string;
    image: string | null;
    gradient: string | null;
  };
}

export interface Template {
  id: string;
  name: string;
  theme: 'light' | 'dark';
  category: 'standard' | 'gradient' | 'pattern';
  colors: {
    background: string;
    cardBackground: string;
    cardBorder: string;
    cardShadow: string;
    text: string;
    heading: string;
    primary: string;
    primaryLight?: string;
    primaryRgb?: string;
    accent: string;
    accentLight?: string;
    accentRgb?: string;
  };
  font: {
    headline: string;
    body: string;
  };
  background: string; // CSS background value (e.g., color, linear-gradient)
  backgroundColor?: string;
  backgroundSize?: string;
  icons?: {
    bullet?: any;
  };
  designs: Record<SlideLayout, React.FC<{ slide: Slide }>>;
}

// History
export interface HistoryItem {
  id: string;
  original: string;
  outline: string;
  timestamp: number;
  model?: string;
  type?: 'text-toolkit' | 'document-summary' | 'tone-analysis';
}

export type PptxLayout =
  | 'LAYOUT_16x9'
  | 'LAYOUT_16x10'
  | 'LAYOUT_4x3'
  | 'LAYOUT_WIDE';

export interface PresentationHistoryItem {
  id: string;
  title: string;
  detailedContent: string;
  templateId: string;
  layout: {
    name: PptxLayout;
    width: number;
    height: number;
  };
  timestamp: number;
}

// Generation Settings
export type SlideType = 'title' | 'list' | 'image' | 'conclusion' | 'default';
export type TextAmount = 'minimal' | 'concise' | 'detailed' | 'extensive';
export type ImageSource = 'automatic' | 'stock' | 'web' | 'ai';
