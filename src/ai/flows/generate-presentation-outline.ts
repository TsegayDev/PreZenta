'use server';

/**
 * @fileOverview A presentation outline generation AI agent.
 *
 * - generatePresentationOutline - A function that handles the presentation outline generation process.
 * - GeneratePresentationOutlineInput - The input type for the generatePresentationOutline function.
 * - GeneratePresentationOutlineOutput - The return type for the generatePresentationOutline function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import { useSlides } from '@/hooks/use-slides';

const GeneratePresentationOutlineInputSchema = z.object({
  topic: z.string().describe('The core topic for the presentation.'),
  numberOfSlides: z.number().describe('The desired number of slides for the presentation.'),
  textAmount: z.string().describe('The desired amount of text per slide (e.g., minimal, concise, detailed).'),
});
export type GeneratePresentationOutlineInput = z.infer<typeof GeneratePresentationOutlineInputSchema>;

const GeneratePresentationOutlineOutputSchema = z.object({
  outline: z.string().describe('The generated presentation outline, formatted in Markdown. It should include a title slide and numbered content slides with titles and bullet points.'),
});
export type GeneratePresentationOutlineOutput = z.infer<typeof GeneratePresentationOutlineOutputSchema>;

export async function generatePresentationOutline(input: GeneratePresentationOutlineInput): Promise<GeneratePresentationOutlineOutput> {
  return generatePresentationOutlineFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePresentationOutlinePrompt',
  input: {schema: GeneratePresentationOutlineInputSchema},
  output: {schema: GeneratePresentationOutlineOutputSchema},
  prompt: `You are an expert presentation designer. Generate a detailed presentation outline in Markdown format based on the following topic.

The outline should be for a presentation of exactly {{{numberOfSlides}}} slides.

The response must be only the Markdown outline, starting with a title slide (e.g., "# Slide 1: Title of Presentation") and followed by the subsequent content slides (e.g., "## Slide 2: Introduction"). Each content slide must have a title and 3-5 bullet points.

The amount of text and detail for each bullet point should be tailored to a "{{{textAmount}}}" level.
- minimal: Just a few keywords or a very short phrase. But with in a max of 150 character bullet points
- concise: A short sentence for each bullet point.But with in a max of 250 character bullet points
- detailed: 1-2 complete sentences per bullet point.But with in a max of 350 character bullet points
- extensive: 2-3 sentences or a very detailed phrase per bullet point.But with in a max of 500 character bullet points

Topic: {{{topic}}}
`,
});

const generatePresentationOutlineFlow = ai.defineFlow(
  {
    name: 'generatePresentationOutlineFlow',
    inputSchema: GeneratePresentationOutlineInputSchema,
    outputSchema: GeneratePresentationOutlineOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
