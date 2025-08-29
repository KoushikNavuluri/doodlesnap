"use server";

import { transformImageWithDoodles, type TransformImageWithDoodlesInput } from "@/ai/flows/transform-image-with-doodles";

export async function generateDoodle(input: TransformImageWithDoodlesInput): Promise<{ doodledImage?: string; error?: string }> {
  try {
    if (!input.photoDataUri) {
        return { error: 'Image data is missing.' };
    }
    const result = await transformImageWithDoodles(input);

    return {
      doodledImage: result.doodledImage,
    };
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return {
      error: `Failed to generate doodle. ${errorMessage}`,
    };
  }
}
