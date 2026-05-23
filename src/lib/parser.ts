import { v4 as uuidv4 } from 'uuid';
import type { Slide, SlideElement, SlideLayout } from './types';

/**
 * Determines the most appropriate layout for a slide based on its content.
 * @param elements - The structured elements of the slide.
 * @param isFirstSlide - Whether this is the first slide in the presentation.
 * @returns The determined SlideLayout.
 */
function determineLayout(elements: SlideElement[], isFirstSlide: boolean): SlideLayout {
    if (isFirstSlide) {
        return 'title';
    }

    const listElement = elements.find(e => e.type === 'list');
    const bulletPoints = listElement ? listElement.content.split('\n').length : 0;
    
    if (bulletPoints > 4) {
        return 'two-column';
    }
    if (bulletPoints > 0) {
        return 'title-bullets';
    }
    
    const quoteElement = elements.find(e => e.type === 'quote');
    if (quoteElement) {
        return 'quote';
    }
    
    return 'content'; // Default layout for content-heavy slides without lists.
}


/**
 * Parses a Markdown string outline into an array of Slide objects,
 * intelligently determining the layout for each slide and structuring its elements.
 */
export function parseOutline(outline: string): Slide[] {
  if (!outline || typeof outline !== 'string') {
    return [];
  }

  // Split the outline into individual slide sections. Handles variations in slide numbering.
  const slideSections = outline.split(/(?=^#+\s*Slide\s*\d*:)/m).filter(Boolean);

  return slideSections.map((section, index) => {
    const lines = section.trim().split('\n');
    const titleLine = lines.shift()?.replace(/^#+\s*Slide\s*\d*:/, '').trim() || `Slide ${index + 1}`;
    
    const elements: SlideElement[] = [];

    // Always add title element as the main heading of the slide content
    elements.push({
        id: uuidv4(),
        type: 'heading',
        content: titleLine,
    });
    
    let currentList: string[] = [];
    
    lines.forEach(line => {
      const trimmedLine = line.trim();
      // Check for list items (e.g., "*", "-", "1.")
      if (trimmedLine.match(/^(\*|-|\d+\.)\s/)) {
        // Remove the list marker for content
        let listItemContent = trimmedLine.replace(/^(\*|-|\d+\.)\s/, '');
        // Remove bold markers from labels
        listItemContent = listItemContent.replace(/\*\*(.*?)\*\*/g, '$1');
        currentList.push(listItemContent);
      } else {
        // If we were processing a list, push it to elements
        if (currentList.length > 0) {
          elements.push({ id: uuidv4(), type: 'list', content: currentList.join('\n') });
          currentList = [];
        }
        // If the line is not empty, treat it as a paragraph
        if (trimmedLine) {
          elements.push({ id: uuidv4(), type: 'paragraph', content: trimmedLine });
        }
      }
    });

    // Add any remaining list items
    if (currentList.length > 0) {
      elements.push({ id: uuidv4(), type: 'list', content: currentList.join('\n') });
    }

    const layout = determineLayout(elements, index === 0);
    const fullContent = lines.join('\n').trim();

    return {
      id: uuidv4(),
      title: titleLine, // The main title of the slide for indexing
      content: fullContent, // keep the raw content for reference
      elements, // The structured JSON content of the slide
      layout,
      transition: 'slide',
      icon: 'RectangleHorizontal',
      notes: '',
      background: {
          color: '#ffffff',
          image: null,
          gradient: null,
      },
    };
  });
}
