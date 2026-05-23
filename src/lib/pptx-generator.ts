
import pptxgen from "pptxgenjs";
import type { Slide, Template, PptxLayout, SlideElement } from './types';

// Helper to remove the '#' from hex color codes
const cleanHex = (hex: string) => (hex.startsWith('#') ? hex.substring(1) : hex);

// Helper to get the primary font name from a font stack
export const getFontFace = (fontStack: string | undefined, defaultFont: string = 'Arial') => {
    if (!fontStack) return defaultFont;
    return fontStack.split(',')[0].replace(/['"]/g, '').trim();
};

// Map layout to master name
const mapLayoutToMasterName = (layout: Slide['layout']): string => {
    switch (layout) {
        case 'title': return 'TITLE_SLIDE';
        case 'content': return 'TITLE_AND_CONTENT';
        case 'two-column': return 'TWO_CONTENT';
        case 'comparison': return 'COMPARISON';
        case 'blank': return 'BLANK';
        case 'quote': return 'QUOTE_SLIDE';
        case 'image-right': return 'IMAGE_RIGHT_SLIDE';
        case 'image-left': return 'IMAGE_LEFT_SLIDE';
        case 'section-header': return 'SECTION_HEADER';
        default: return 'TITLE_AND_CONTENT';
    }
};

// Process markdown-like formatting for PPTX
const processTextFormatting = (text: string): pptxgen.TextProps[] => {
    if (!text) return [];
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g).filter(Boolean);
    
    return parts.map(part => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return { text: part.slice(2, -2), options: { bold: true } };
        }
        if (part.startsWith('*') && part.endsWith('*')) {
            return { text: part.slice(1, -1), options: { italic: true } };
        }
        if (part.startsWith('`') && part.endsWith('`')) {
            return { text: part.slice(1, -1), options: { fontFace: 'Courier New' } };
        }
        return { text: part };
    });
};

// Extract content elements by type, excluding any heading that matches the slide title
const extractContentElements = (elements: SlideElement[], slideTitle: string) => {
    const headingElement = elements.find(el => el.type === 'heading');
    const paragraphElements = elements.filter(el => el.type === 'paragraph');
    const listElement = elements.find(el => el.type === 'list');
    const imageElement = elements.find(el => el.type === 'image');
    
    // Only use heading if it's different from the slide title
    const headingText = headingElement && headingElement.content !== slideTitle 
        ? headingElement.content 
        : '';
    
    return {
        headingText,
        paragraphText: paragraphElements.map(el => el.content).join('\n'),
        listItems: listElement ? listElement.content.split('\n').filter(Boolean) : [],
        hasImage: !!imageElement,
        imageUrl: imageElement ? imageElement.content : null
    };
};

// Add background to slide if applicable
const addBackgroundToSlide = (slide: pptxgen.Slide, image: string | null, fallbackColor: string) => {
    if (image) {
        slide.background = { data: image };
    } else {
        slide.background = { color: cleanHex(fallbackColor) };
    }
};

// Add title to slide, explicitly clearing the placeholder if no title is provided.
const addTitleToSlide = (slide: pptxgen.Slide, title: string, template: Template) => {
    const titleFontFace = getFontFace(template.font.headline);
    const textProps = title ? processTextFormatting(title) : [];

    slide.addText(textProps, {
        placeholder: 'title',
        fontFace: titleFontFace,
        color: cleanHex(template.colors.heading),
        fontSize: 24,
    });
};


// Process content layout
const processContentLayout = (slide: pptxgen.Slide, slideData: Slide, template: Template) => {
    const { paragraphText, listItems } = extractContentElements(slideData.elements, slideData.title);
    const bodyFontFace = getFontFace(template.font.body);
    
    const content = [];
    if (paragraphText) {
        content.push({ text: paragraphText, options: { fontSize: 14, fontFace: bodyFontFace, color: cleanHex(template.colors.text) } });
    }
    if (listItems.length > 0) {
        listItems.forEach(item => {
            content.push({ text: item, options: { bullet: true, fontSize: 14, fontFace: bodyFontFace, color: cleanHex(template.colors.text) } });
        });
    }

    if (content.length > 0) {
        slide.addText(content, { placeholder: 'body' });
    }
};

// Process two-column layout
const processTwoColumnLayout = (slide: pptxgen.Slide, slideData: Slide, template: Template) => {
    const { paragraphText, listItems } = extractContentElements(slideData.elements, slideData.title);
    const bodyFontFace = getFontFace(template.font.body);

    const allContent = [];
    if (paragraphText) allContent.push(paragraphText);
    allContent.push(...listItems);

    if (allContent.length === 0) return;

    const midPoint = Math.ceil(allContent.length / 2);
    const leftColumnItems = allContent.slice(0, midPoint);
    const rightColumnItems = allContent.slice(midPoint);

    if (leftColumnItems.length > 0) {
        slide.addText(leftColumnItems.map(item => ({ text: item, options: { bullet: true } })), {
            placeholder: 'body1',
            fontFace: bodyFontFace,
            fontSize: 14,
            color: cleanHex(template.colors.text),
        });
    }

    if (rightColumnItems.length > 0) {
        slide.addText(rightColumnItems.map(item => ({ text: item, options: { bullet: true } })), {
            placeholder: 'body2',
            fontFace: bodyFontFace,
            fontSize: 14,
            color: cleanHex(template.colors.text),
        });
    }
};


// Process title layout
const processTitleLayout = (slide: pptxgen.Slide, slideData: Slide, template: Template) => {
    const { paragraphText } = extractContentElements(slideData.elements, slideData.title);
    const bodyFontFace = getFontFace(template.font.body);
    
    if (paragraphText) {
        slide.addText(processTextFormatting(paragraphText), { 
            placeholder: 'subtitle',
            fontSize: 18, fontFace: bodyFontFace,
            color: cleanHex(template.colors.text)
        });
    } else {
        // Explicitly clear the subtitle if there is no content for it
        slide.addText('', { placeholder: 'subtitle' });
    }
};

// Process blank layout
const processBlankLayout = (slide: pptxgen.Slide, slideData: Slide, template: Template) => {
    const { headingText, paragraphText, listItems } = extractContentElements(slideData.elements, slideData.title);
    const bodyFontFace = getFontFace(template.font.body);
    
    let contentY = 1.0;
    
    if (headingText) {
        slide.addText(processTextFormatting(headingText), { 
            x: 0.5, y: contentY, w: '90%', h: 0.7, 
            fontSize: 20, fontFace: bodyFontFace, 
            color: cleanHex(template.colors.heading), bold: true 
        });
        contentY += 0.8;
    }
    
    const content = [];
    if (paragraphText) {
        content.push({ text: paragraphText });
    }
    if (listItems.length > 0) {
        listItems.forEach(item => {
            content.push({ text: item, options: { bullet: true } });
        });
    }

    if (content.length > 0) {
        slide.addText(content, {
            x: 0.5, y: contentY, w: '90%', h: 6.5 - contentY,
            fontFace: bodyFontFace, fontSize: 14, color: cleanHex(template.colors.text)
        });
    }
};

// Process image layouts
const processImageLayout = (slide: pptxgen.Slide, slideData: Slide, template: Template, isImageRight: boolean = true) => {
    const { paragraphText, listItems, imageUrl } = extractContentElements(slideData.elements, slideData.title);
    const bodyFontFace = getFontFace(template.font.body);
    
    const imageX = isImageRight ? 5.5 : 0.5;
    const textPlaceholder = isImageRight ? 'body1' : 'body2';
    const imageW = 4.0;
    
    if (imageUrl) {
        slide.addImage({
            path: imageUrl,
            x: imageX,
            y: 1.7,
            w: imageW,
            h: 3.5
        });
    }
    
    const content = [];
    if (paragraphText) {
        content.push({ text: paragraphText });
    }
    if (listItems.length > 0) {
        listItems.forEach(item => {
            content.push({ text: item, options: { bullet: true } });
        });
    }

    if (content.length > 0) {
        slide.addText(content, {
            placeholder: textPlaceholder,
            fontFace: bodyFontFace, fontSize: 14, color: cleanHex(template.colors.text)
        });
    }
};

export const generatePptx = async (
    backgroundImages: string[], 
    slides: Slide[], 
    template: Template, 
    layoutName: PptxLayout,
    presentationTitle: string
): Promise<void> => {
    if (!slides || slides.length === 0) {
        throw new Error("No slides data provided.");
    }
    if (!template) {
        throw new Error("No template data provided.");
    }
    if (!backgroundImages || backgroundImages.length !== slides.length) {
        throw new Error("Mismatched number of slides and background images.");
    }
    
    const pptx = new pptxgen();
    
    // Set presentation properties
    pptx.layout = layoutName;
    pptx.author = 'PreZenta';
    pptx.company = 'AI Presentation Generator';
    pptx.title = presentationTitle;
    
    // Get font faces
    const titleFontFace = getFontFace(template.font.headline);
    const bodyFontFace = getFontFace(template.font.body);
    const masterBackground = { color: cleanHex(template.colors.background) };
    
    // Define master slides
    pptx.defineSlideMaster({
        title: "TITLE_SLIDE",
        background: masterBackground,
        objects: [
            { 'placeholder': { options: { name: "title", type: "title", x: 0.5, y: 2.5, w: "90%", h: 1.5, fontFace: titleFontFace, fontSize: 44, color: cleanHex(template.colors.heading), bold: true, align: 'center' } } },
            { 'placeholder': { options: { name: "subtitle", type: "body", x: 0.5, y: 4.0, w: "90%", h: 1.0, fontFace: bodyFontFace, fontSize: 24, color: cleanHex(template.colors.text), align: 'center' } } }
        ]
    });
    
    pptx.defineSlideMaster({
        title: "TITLE_AND_CONTENT",
        background: masterBackground,
        objects: [
            { 'placeholder': { options: { name: "title", type: "title", x: 0.5, y: 0.5, w: "90%", h: 1.0, fontFace: titleFontFace, fontSize: 32, color: cleanHex(template.colors.heading), bold: true } } },
            { 'placeholder': { options: { name: "body", type: "body", x: 0.5, y: 1.7, w: "90%", h: 5.0, fontFace: bodyFontFace, fontSize: 18, color: cleanHex(template.colors.text) } } }
        ]
    });
    
    pptx.defineSlideMaster({
        title: "TWO_CONTENT",
        background: masterBackground,
        objects: [
             { 'placeholder': { options: { name: "title", type: "title", x: 0.5, y: 0.5, w: "90%", h: 1.0, fontFace: titleFontFace, fontSize: 32, color: cleanHex(template.colors.heading), bold: true } } },
             { 'placeholder': { options: { name: "body1", type: "body", x: 0.5, y: 1.7, w: "42.5%", h: 5.0, fontFace: bodyFontFace, fontSize: 16, color: cleanHex(template.colors.text) } } },
             { 'placeholder': { options: { name: "body2", type: "body", x: 5.25, y: 1.7, w: "42.5%", h: 5.0, fontFace: bodyFontFace, fontSize: 16, color: cleanHex(template.colors.text) } } }
        ]
    });
    
    pptx.defineSlideMaster({
        title: "BLANK",
        background: masterBackground,
        objects: []
    });
    
    pptx.defineSlideMaster({
        title: "QUOTE_SLIDE",
        background: masterBackground,
        objects: [
            { 'placeholder': { options: { name: "title", type: "title", x: 0.5, y: 0.5, w: "90%", h: 1.0, fontFace: titleFontFace, fontSize: 32, color: cleanHex(template.colors.heading), bold: true } } },
            { 'placeholder': { options: { name: "quote", type: "body", x: 1.0, y: 2.0, w: "80%", h: 3.0, fontFace: bodyFontFace, fontSize: 28, color: cleanHex(template.colors.text), align: 'center', italic: true } } },
            { 'placeholder': { options: { name: "attribution", type: "body", x: 6.5, y: 5.0, w: "30%", h: 0.5, fontFace: bodyFontFace, fontSize: 20, color: cleanHex(template.colors.text), align: 'right' } } }
        ]
    });
    
    pptx.defineSlideMaster({
        title: "IMAGE_RIGHT_SLIDE",
        background: masterBackground,
        objects: [
            { 'placeholder': { options: { name: "title", type: "title", x: 0.5, y: 0.5, w: "90%", h: 1.0, fontFace: titleFontFace, fontSize: 32, color: cleanHex(template.colors.heading), bold: true } } },
            { 'placeholder': { options: { name: "body1", type: "body", x: 0.5, y: 1.7, w: "4.5%", h: 5.0, fontFace: bodyFontFace, fontSize: 16, color: cleanHex(template.colors.text) } } }
        ]
    });
    
    pptx.defineSlideMaster({
        title: "IMAGE_LEFT_SLIDE",
        background: masterBackground,
        objects: [
            { 'placeholder': { options: { name: "title", type: "title", x: 0.5, y: 0.5, w: "90%", h: 1.0, fontFace: titleFontFace, fontSize: 32, color: cleanHex(template.colors.heading), bold: true } } },
            { 'placeholder': { options: { name: "body2", type: "body", x: 5.0, y: 1.7, w: "4.5%", h: 5.0, fontFace: bodyFontFace, fontSize: 16, color: cleanHex(template.colors.text) } } }
        ]
    });
    
    pptx.defineSlideMaster({
        title: "SECTION_HEADER",
        background: masterBackground,
        objects: [
            { 'placeholder': { options: { name: "title", type: "title", x: 0.5, y: 2.5, w: "90%", h: 1.5, fontFace: titleFontFace, fontSize: 44, color: cleanHex(template.colors.heading), bold: true, align: 'center' } } }
        ]
    });
    
    // Process each slide
    try {
        slides.forEach((slideData, index) => {
            const slideImage = backgroundImages[index];
            const masterName = mapLayoutToMasterName(slideData.layout);
            const slide = pptx.addSlide({ masterName });
            
            addBackgroundToSlide(slide, slideImage, template.colors.background);
            addTitleToSlide(slide, slideData.title, template);
            
            // Process content based on layout
            switch (slideData.layout) {
                case 'content':
                case 'title-bullets':
                    processContentLayout(slide, slideData, template);
                    break;
                case 'two-column':
                    processTwoColumnLayout(slide, slideData, template);
                    break;
                case 'title':
                    processTitleLayout(slide, slideData, template);
                    break;
                case 'blank':
                    processBlankLayout(slide, slideData, template);
                    break;
                case 'quote':
                    // Quote layout would have specific handling
                    break;
                case 'image-right':
                    processImageLayout(slide, slideData, template, true);
                    break;
                case 'image-left':
                    processImageLayout(slide, slideData, template, false);
                    break;
                case 'section-header':
                    // Section header only has a title, no additional content
                    break;
                default:
                    // Default to content layout
                    processContentLayout(slide, slideData, template);
            }
        });
        
        // Write the presentation to a file
        await pptx.writeFile({ fileName: `PreZenta - ${presentationTitle}.pptx` });
    } catch (error) {
        console.error("Error generating PPTX:", error);
        throw new Error(`Failed to generate presentation: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
};
