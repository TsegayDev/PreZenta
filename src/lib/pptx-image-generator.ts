
import pptxgen from "pptxgenjs";
import type { PptxLayout } from './types';

/**
 * Generates an uneditable PowerPoint presentation where each slide is an image.
 * This is useful for preserving complex formatting, fonts, and layouts exactly as they appear in the web editor.
 *
 * @param images - An array of base64 encoded image strings, one for each slide.
 * @param layoutName - The PptxLayout string (e.g., 'LAYOUT_16x9') to set the presentation's aspect ratio.
 * @param presentationTitle - The title of the presentation, used for the filename.
 * @returns A promise that resolves when the PPTX file has been generated and downloaded.
 */
export const generateUneditablePptx = async (images: string[], layoutName: PptxLayout, presentationTitle: string): Promise<void> => {
    if (!images || images.length === 0) {
        throw new Error("No slide images provided for uneditable PPTX generation.");
    }
    
    const pptx = new pptxgen();
    
    // Set presentation properties based on the provided layout
    pptx.layout = layoutName;
    pptx.author = 'PreZenta';
    pptx.company = 'AI Presentation Generator';
    pptx.title = presentationTitle || 'Presentation';

    // Define a single blank master slide that will be used for all slides
    // The master slide itself is blank; we will set the image on each individual slide.
    pptx.defineSlideMaster({
        title: "IMAGE_BACKGROUND_MASTER",
        background: { color: "000000" }, // Black background in case image has transparency
        objects: []
    });

    // Create a slide for each captured image
    for (const imageData of images) {
        const slide = pptx.addSlide({ masterName: "IMAGE_BACKGROUND_MASTER" });
        
        // Set the captured slide image as the full-page background
        slide.background = {
            data: imageData,
        };
    }
    
    // Write the presentation to a file for download
    try {
        await pptx.writeFile({ fileName: `PreZenta - ${presentationTitle || 'Presentation'}.pptx` });
    } catch (error) {
        console.error("Error writing uneditable PPTX file:", error);
        throw new Error("Failed to generate and save the uneditable presentation.");
    }
};
