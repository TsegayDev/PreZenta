// components/ui/typing-effect.tsx
'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface TypingEffectProps {
  content: string;
  isStreaming: boolean;
  onComplete?: () => void;
}

export function TypingEffect({ content, isStreaming, onComplete }: TypingEffectProps) {
  const [displayedContent, setDisplayedContent] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!isStreaming) {
      // If not streaming anymore, show all content immediately
      setDisplayedContent(content);
      setCurrentIndex(content.length);
      return;
    }

    // If streaming, gradually reveal content
    if (currentIndex < content.length) {
      const timer = setTimeout(() => {
        setDisplayedContent(content.substring(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 10); // Adjust typing speed here

      return () => clearTimeout(timer);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, content, isStreaming, onComplete]);

  return (
    <span>
      {displayedContent}
      {isStreaming && currentIndex < content.length && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.2, repeat: Infinity }}
          className="inline-block w-2 h-4 bg-primary rounded-full ml-1 align-middle"
        />
      )}
    </span>
  );
}