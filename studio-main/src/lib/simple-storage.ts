import { Storage } from '@google-cloud/storage';

interface UploadImageOptions {
  buffer: Buffer;
  fileName: string;
  contentType: string;
  userId: string;
  metadata?: {
    isOriginal?: boolean;
    parentImageId?: string;
    stylePrompt?: string;
    templateUsed?: string;
  };
}

class SimpleStorageService {
  private storage: Storage;
  private bucketName: string;

  constructor() {
    this.bucketName = 'doodle-snap';
    this.storage = new Storage({
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID || 'snappy-bucksaw-462516-t4',
      keyFilename: process.env.GOOGLE_CLOUD_KEY_FILE || './credentials/service-account-key.json',
    });
  }

  /**
   * Upload an image with metadata stored in GCS object metadata
   */
  async uploadImage(options: UploadImageOptions): Promise<{ imageUrl: string; fileName: string }> {
    try {
      const { buffer, fileName, contentType, userId, metadata = {} } = options;
      
      // Generate a unique filename with timestamp and user ID
      const timestamp = Date.now();
      const uniqueFileName = `${userId}/${timestamp}-${fileName}`;
      
      const bucket = this.storage.bucket(this.bucketName);
      const file = bucket.file(uniqueFileName);
      
      // Store metadata in GCS object metadata
      const customMetadata = {
        userId,
        originalName: fileName,
        uploadedAt: new Date().toISOString(),
        isOriginal: metadata.isOriginal?.toString() || 'true',
        ...(metadata.parentImageId && { parentImageId: metadata.parentImageId }),
        ...(metadata.stylePrompt && { stylePrompt: metadata.stylePrompt.substring(0, 1000) }), // Limit length
        ...(metadata.templateUsed && { templateUsed: metadata.templateUsed }),
      };
      
      // Upload the buffer with metadata
      await file.save(buffer, {
        metadata: {
          contentType,
          metadata: customMetadata, // Custom metadata stored with the file
        },
      });
      
      // Generate a signed URL for access (valid for 1 year)
      const [signedUrl] = await file.getSignedUrl({
        action: 'read',
        expires: Date.now() + 365 * 24 * 60 * 60 * 1000, // 1 year from now
      });
      
      return {
        imageUrl: signedUrl,
        fileName: uniqueFileName,
      };
    } catch (error) {
      console.error('Error uploading image to Google Cloud Storage:', error);
      throw new Error('Failed to upload image');
    }
  }

  /**
   * Get user's images by listing files with their userId prefix
   */
  async getUserImages(userId: string): Promise<Array<{ fileName: string; metadata: any; url: string }>> {
    try {
      const bucket = this.storage.bucket(this.bucketName);
      const [files] = await bucket.getFiles({
        prefix: `${userId}/`, // Only get files in the user's folder
      });
      
      const userImages = [];
      
      for (const file of files) {
        // Get file metadata
        const [metadata] = await file.getMetadata();
        
        // Generate signed URL
        const [signedUrl] = await file.getSignedUrl({
          action: 'read',
          expires: Date.now() + 365 * 24 * 60 * 60 * 1000,
        });
        
        userImages.push({
          fileName: file.name,
          metadata: metadata.metadata || {},
          url: signedUrl,
        });
      }
      
      return userImages;
    } catch (error) {
      console.error('Error getting user images:', error);
      throw new Error('Failed to get user images');
    }
  }

  /**
   * Get user's Doodle Snaps (grouped originals with their doodles)
   */
  async getUserDoodleProjects(userId: string): Promise<Array<{
    original: { fileName: string; metadata: any; url: string };
    doodle: { fileName: string; metadata: any; url: string };
  }>> {
    try {
      const allImages = await this.getUserImages(userId);
      
      // Separate originals and doodles
      const originals = allImages.filter(img => img.metadata.isOriginal === 'true');
      const doodles = allImages.filter(img => img.metadata.isOriginal === 'false');
      
      const projects = [];
      
      // Match each doodle with its original
      for (const doodle of doodles) {
        if (doodle.metadata.parentImageId) {
          const original = originals.find(orig => 
            orig.fileName === doodle.metadata.parentImageId
          );
          
          if (original) {
            projects.push({
              original,
              doodle,
            });
          }
        }
      }
      
      // Sort by doodle creation date (newest first)
      projects.sort((a, b) => {
        const dateA = new Date(a.doodle.metadata.uploadedAt || 0).getTime();
        const dateB = new Date(b.doodle.metadata.uploadedAt || 0).getTime();
        return dateB - dateA;
      });
      
      return projects;
    } catch (error) {
      console.error('Error getting user Doodle Snaps:', error);
      throw new Error('Failed to get user Doodle Snaps');
    }
  }

  /**
   * Delete an image
   */
  async deleteImage(fileName: string): Promise<void> {
    try {
      const bucket = this.storage.bucket(this.bucketName);
      const file = bucket.file(fileName);
      await file.delete();
    } catch (error) {
      console.error('Error deleting image:', error);
      throw new Error('Failed to delete image');
    }
  }
}

export const simpleStorage = new SimpleStorageService();
export { SimpleStorageService };
