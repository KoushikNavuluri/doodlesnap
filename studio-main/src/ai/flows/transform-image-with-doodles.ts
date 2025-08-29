'use server';
/**
 * @fileOverview Transforms an uploaded image into a whimsical journal entry with hand-sketched doodles.
 *
 * - transformImageWithDoodles - A function that transforms the image with doodles.
 * - TransformImageWithDoodlesInput - The input type for the transformImageWithDoodles function.
 * - TransformImageWithDoodlesOutput - The return type for the transformImageWithDoodles function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TransformImageWithDoodlesInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo to be transformed, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  stylePrompt: z
    .string()
    .optional()
    .describe("Optional style preferences or prompts to guide the doodle transformation."),
});
export type TransformImageWithDoodlesInput = z.infer<typeof TransformImageWithDoodlesInputSchema>;

const TransformImageWithDoodlesOutputSchema = z.object({
  doodledImage: z
    .string()
    .describe("The transformed image with doodles, as a data URI."),
});
export type TransformImageWithDoodlesOutput = z.infer<typeof TransformImageWithDoodlesOutputSchema>;

export async function transformImageWithDoodles(
  input: TransformImageWithDoodlesInput
): Promise<TransformImageWithDoodlesOutput> {
  return transformImageWithDoodlesFlow(input);
}

const transformImageWithDoodlesFlow = ai.defineFlow(
  {
    name: 'transformImageWithDoodlesFlow',
    inputSchema: TransformImageWithDoodlesInputSchema,
    outputSchema: TransformImageWithDoodlesOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.5-flash-image-preview',
      prompt: [
        {
          media: {url: input.photoDataUri},
        },
        {
          text: `Transform this photo into a whimsical, illustrated journal entry image. Overlay crisp, hand-sketched white doodles that feel spontaneous and playful—like notes scribbled in the margins of a travel diary. Highlight key objects with loose outlines, add quirky arrows and fun labels pointing out little details, and sprinkle in whimsical symbols, icons, or short handwritten-style comments. Keep all doodles and annotations in a clean white ink aesthetic. Make sure faces of people (if present) remain untouched and clear—doodles should enhance the scene without covering or distorting human features. Don't Modify Faces Please. ${
            input.stylePrompt
              ? `Incorporate the following style preferences into the doodle style: ${input.stylePrompt}`
              : ''
          }`,
        },
      ],
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_ONLY_HIGH',
          },
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_NONE',
          },
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
          {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_LOW_AND_ABOVE',
          },
        ],
      },
    });

    return {doodledImage: media!.url!};
  }
);
