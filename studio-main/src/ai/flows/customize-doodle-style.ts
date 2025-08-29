'use server';

/**
 * @fileOverview A flow that transforms an image into a whimsical, illustrated journal entry image with customizable doodle styles.
 *
 * - customizeDoodleStyle - A function that handles the image transformation process.
 * - CustomizeDoodleStyleInput - The input type for the customizeDoodleStyle function.
 * - CustomizeDoodleStyleOutput - The return type for the customizeDoodleStyle function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CustomizeDoodleStyleInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo to transform, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  stylePrompt: z
    .string()
    .optional()
    .describe("Optional style preferences or prompts to influence the doodle style."),
});

export type CustomizeDoodleStyleInput = z.infer<typeof CustomizeDoodleStyleInputSchema>;

const CustomizeDoodleStyleOutputSchema = z.object({
  doodledImage: z
    .string()
    .describe("The transformed image with doodles, as a data URI."),
});

export type CustomizeDoodleStyleOutput = z.infer<typeof CustomizeDoodleStyleOutputSchema>;

export async function customizeDoodleStyle(
  input: CustomizeDoodleStyleInput
): Promise<CustomizeDoodleStyleOutput> {
  return customizeDoodleStyleFlow(input);
}

const customizeDoodleStyleFlow = ai.defineFlow(
  {
    name: 'customizeDoodleStyleFlow',
    inputSchema: CustomizeDoodleStyleInputSchema,
    outputSchema: CustomizeDoodleStyleOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.5-flash-image-preview',
      prompt: [
        {
          media: {url: input.photoDataUri}},
        {
          text: `Transform this photo into a whimsical, illustrated journal entry image. Overlay crisp, hand-sketched white doodles that feel spontaneous and playful—like notes scribbled in the margins of a travel diary. Highlight key objects with loose outlines, add quirky arrows and fun labels pointing out little details, and sprinkle in whimsical symbols, icons, or short handwritten-style comments. Keep all doodles and annotations in a clean white ink aesthetic. Make sure faces of people (if present) remain untouched and clear—doodles should enhance the scene without covering or distorting human features. Don't Modify Faces Please. ${input.stylePrompt ? `Incorporate the following style preferences into the doodle style: ${input.stylePrompt}` : ''}`},
      ],
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });
    return {doodledImage: media.url!};
  }
);
