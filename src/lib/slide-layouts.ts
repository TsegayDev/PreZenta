import type { Slide, SlideLayout, Template } from './types';
import { layoutDesigns } from './layout-designs';

interface Design {
  html: string;
  css: string;
}

/**
 * Retrieves the HTML and CSS for a given slide layout.
 * @param layout - The layout type of the slide.
 * @returns An object containing the html and css for the layout, or null if not found.
 */
export function getLayoutDesign(layout: SlideLayout): Design | null {
  const design = layoutDesigns.layouts[layout];
  if (design) {
    return {
      html: design.html,
      css: design.css,
    };
  }
  // Fallback to a default content layout if the specified layout is not found
  const fallbackDesign = layoutDesigns.layouts['content'];
  return fallbackDesign ? { html: fallbackDesign.html, css: fallbackDesign.css } : null;
}

/**
 * Creates the CSS variables string from a template.
 * @param template - The theme template object.
 * @returns A string of CSS variables.
 */
export function createThemeVariables(template: Template): string {
  const variables = layoutDesigns.themeVariables;
  let css = ':root {';
  
  // Basic color properties
  css += variables['--background'].replace('{background}', template.colors.background);
  css += variables['--cardBackground'].replace('{cardBackground}', template.colors.cardBackground);
  css += variables['--cardBorder'].replace('{cardBorder}', template.colors.cardBorder);
  css += variables['--cardShadow'].replace('{cardShadow}', template.colors.cardShadow);
  css += variables['--text'].replace('{text}', template.colors.text);
  css += variables['--heading'].replace('{heading}', template.colors.heading);
  css += variables['--primary'].replace('{primary}', template.colors.primary);
  css += variables['--accent'].replace('{accent}', template.colors.accent);
  
  // Additional color properties with fallbacks
  css += variables['--primary-light'].replace('{primaryLight}', 
    template.colors.primaryLight || lightenColor(template.colors.primary, 30));
  css += variables['--accent-light'].replace('{accentLight}', 
    template.colors.accentLight || lightenColor(template.colors.accent, 30));
  css += variables['--primary-rgb'].replace('{primaryRgb}', 
    template.colors.primaryRgb || hexToRgb(template.colors.primary));
  css += variables['--accent-rgb'].replace('{accentRgb}', 
    template.colors.accentRgb || hexToRgb(template.colors.accent));
  
  // Font properties
  css += variables['--headline-font'].replace('{headline}', template.font.headline);
  css += variables['--body-font'].replace('{body}', template.font.body);
  
  // Add defaults for other variables if they exist in the config
  css += (variables['--border-radius'] || '').replace('{borderRadius}', '12px');
  css += (variables['--shadow'] || '').replace('{shadow}', '0 4px 12px rgba(0, 0, 0, 0.1)');
  css += (variables['--spacing'] || '').replace('{spacing}', '2rem');
  
  css += '}';
  return css;
}

/**
 * Helper function to convert hex color to RGB format
 */
function hexToRgb(hex: string): string {
  // Remove # if present
  hex = hex.replace(/^#/, '');
  
  // Parse the hex values
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  
  return `${r}, ${g}, ${b}`;
}

/**
 * Helper function to create a lighter version of a hex color
 */
function lightenColor(hex: string, percent: number): string {
  // Remove # if present
  hex = hex.replace(/^#/, '');
  
  // Parse the hex values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Lighten
  const newR = Math.min(255, Math.floor(r + (255 - r) * percent / 100));
  const newG = Math.min(255, Math.floor(g + (255 - g) * percent / 100));
  const newB = Math.min(255, Math.floor(b + (255 - b) * percent / 100));
  
  // Convert back to hex
  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
}

/**
 * Injects slide data into the layout's HTML template.
 * This function now handles multi-column layouts for bullet points automatically.
 * @param html - The HTML template string with placeholders.
 * @param slide - The slide data object.
 * @returns The populated HTML string.
 */
export function populateTemplate(html: string, slide: Slide): string {
  let populatedHtml = html;
  
  // Find elements in the slide
  const titleElement = slide.elements.find(el => el.type === 'heading');
  const paragraphElements = slide.elements.filter(el => el.type === 'paragraph');
  const listElement = slide.elements.find(el => el.type === 'list');
  
  // Extract content
  const title = titleElement?.content || '';
  const paragraphs = paragraphElements.map(p => p.content).join('\n\n');
  const bulletPoints = listElement ? listElement.content.split('\n').map(item => item.trim()).filter(item => item) : [];
  
  // Replace basic placeholders
  populatedHtml = populatedHtml.replace(/\{\{title\}\}/g, title);
  populatedHtml = populatedHtml.replace(/\{\{content\}\}/g, paragraphs);
  
  // Handle bullet points and columns
  if (bulletPoints.length > 0) {
    // Generate HTML for bullet points
    const bulletItemsHtml = bulletPoints.map(item => `<li class="bullet-item">${item}</li>`).join('');
    
    // Determine number of columns based on layout and bullet count
    let numColumns = 1;
    if (slide.layout.includes('two-column') || slide.layout === 'two-column-headed') {
      numColumns = 2;
    } else if (slide.layout.includes('three-column')) {
      numColumns = 3;
    } else if (slide.layout.includes('four-column')) {
      numColumns = 4;
    } else if (slide.layout === 'title-bullets') {
      // For title-bullets, use up to 4 columns based on bullet count
      numColumns = bulletPoints.length >= 4 ? 4 : (bulletPoints.length <= 1 ? 1 : bulletPoints.length);
    }
    
    // Create columns HTML if needed
    if (numColumns > 1) {
      // Distribute bullet points across columns
      const columns: string[][] = Array.from({ length: numColumns }, () => []);
      bulletPoints.forEach((point, index) => {
        columns[index % numColumns].push(point);
      });
      
      // Generate columns HTML
      const columnsHtml = columns.map(col => `
        <div class="column">
          <ul class="bullet-list">
            ${col.map(item => `<li class="bullet-item">${item}</li>`).join('')}
          </ul>
        </div>
      `).join('');
      
      // Replace placeholders
      if (html.includes('{{columns}}')) {
        populatedHtml = populatedHtml.replace('{{columns}}', columnsHtml);
      } else if (html.includes('<ul class="bullet-list"></ul>')) {
        populatedHtml = populatedHtml.replace('<ul class="bullet-list"></ul>', 
          `<div class="columns-container">${columnsHtml}</div>`);
      }
    } else {
      // Single column
      const singleListHtml = `<ul class="bullet-list">${bulletItemsHtml}</ul>`;
      
      // Replace placeholders
      if (html.includes('{{columns}}')) {
        populatedHtml = populatedHtml.replace('{{columns}}', singleListHtml);
      } else if (html.includes('<ul class="bullet-list"></ul>')) {
        populatedHtml = populatedHtml.replace('<ul class="bullet-list"></ul>', singleListHtml);
      }
    }
  } else {
    // No bullet points, remove placeholders
    populatedHtml = populatedHtml.replace('{{columns}}', '');
    populatedHtml = populatedHtml.replace('<ul class="bullet-list"></ul>', '');
  }
  
  return populatedHtml;
}