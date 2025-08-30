/**
 * Convert a base64 data URI to a File object
 */
export function dataURItoFile(dataURI: string, filename: string): File {
  // Split the data URI to get the base64 string
  const [header, base64] = dataURI.split(',');
  
  // Extract mime type from header (e.g., "data:image/png;base64" -> "image/png")
  const mimeMatch = header.match(/data:([^;]+)/);
  const mimeType = mimeMatch ? mimeMatch[1] : 'image/png';
  
  // Convert base64 to byte array
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  
  // Create and return File object
  return new File([byteArray], filename, { type: mimeType });
}

/**
 * Generate a filename for a doodle based on template and timestamp
 */
export function generateDoodleFilename(
  originalFileName?: string, 
  templateName?: string
): string {
  const timestamp = Date.now();
  const baseName = originalFileName 
    ? originalFileName.split('/').pop()?.replace(/\.[^/.]+$/, '') // Remove extension
    : 'doodle';
  
  const suffix = templateName ? `-${templateName.toLowerCase().replace(/\s+/g, '-')}` : '-custom';
  return `${baseName}${suffix}-${timestamp}.png`;
}
