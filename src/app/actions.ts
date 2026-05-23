'use server';

import {
  generatePresentationOutline,
  GeneratePresentationOutlineInput,
  GeneratePresentationOutlineOutput,
} from '@/ai/flows/generate-presentation-outline';
import {
  improvePresentationOutline,
  ImprovePresentationOutlineInput,
  ImprovePresentationOutlineOutput,
} from '@/ai/flows/improve-presentation-outline';

export async function generateOutlineAction(
  input: GeneratePresentationOutlineInput
): Promise<GeneratePresentationOutlineOutput> {
    const result = await generatePresentationOutline(input);
    return result;
}

export async function improveOutlineAction(
  input: ImprovePresentationOutlineInput
): Promise<ImprovePresentationOutlineOutput> {
  return improvePresentationOutline(input);
}
