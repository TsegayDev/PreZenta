'use server';

/**
 * @fileOverview This file defines a Genkit flow for improving an existing presentation outline.
 *
 * - improvePresentationOutline - An async function that takes a presentation outline and a desired number of slides, and returns an improved version.
 * - ImprovePresentationOutlineInput - The input type for the improvePresentationOutline function.
 * - ImprovePresentationOutlineOutput - The return type for the improvePresentationOutline function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const ImprovePresentationOutlineInputSchema = z.object({
  outline: z
    .string()
    .describe('The existing presentation outline to be improved.'),
  numberOfSlides: z.number().describe('The desired number of slides for the improved presentation.'),
  textAmount: z.string().describe('The desired amount of text per slide (e.g., minimal, concise, detailed).'),
});
export type ImprovePresentationOutlineInput = z.infer<
  typeof ImprovePresentationOutlineInputSchema
>;

const ImprovePresentationOutlineOutputSchema = z.object({
  improvedOutline: z.string().describe('The improved presentation outline in Markdown format.'),
});
export type ImprovePresentationOutlineOutput = z.infer<typeof ImprovePresentationOutlineOutputSchema>;


export async function improvePresentationOutline(
  input: ImprovePresentationOutlineInput
): Promise<ImprovePresentationOutlineOutput> {
  return improvePresentationOutlineFlow(input);
}

const prompt = ai.definePrompt({
  name: 'improvePresentationOutlinePrompt',
  input: {schema: ImprovePresentationOutlineInputSchema},
  output: {schema: ImprovePresentationOutlineOutputSchema},
  prompt: `You are an AI presentation expert. Review the following presentation outline and suggest improvements to the phrasing and content.

Adjust the outline to be for a presentation of exactly {{{numberOfSlides}}} slides.

The amount of text and detail for each bullet point should be tailored to a "{{{textAmount}}}" level.
- minimal: Just a few keywords or a very short phrase. But with in a max of 150 character bullet points
- concise: A short sentence for each bullet point.But with in a max of 250 character bullet points
- detailed: 1-2 complete sentences per bullet point.But with in a max of 350 character bullet points
- extensive: 2-3 sentences or a very detailed phrase per bullet point.But with in a max of 500 character bullet points

Original Outline:
{{{outline}}}

Return your response as a JSON object with a single key "improvedOutline" containing the improved outline in Markdown format. Your response should start directly with the first slide title (e.g., "# Slide 1: ..."). Do not include any other text, preamble, or JSON formatting. Focus on clarity, conciseness, and engaging language.`,
});

const improvePresentationOutlineFlow = ai.defineFlow(
  {
    name: 'improvePresentationOutlineFlow',
    inputSchema: ImprovePresentationOutlineInputSchema,
    outputSchema: ImprovePresentationOutlineOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output?.improvedOutline) {
      throw new Error('The AI failed to generate an improved outline. Please try again.');
    }
    return output;
  }
);
