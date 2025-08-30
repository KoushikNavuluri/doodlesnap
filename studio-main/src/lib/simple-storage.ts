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
    
    try {
      this.storage = new Storage({
        projectId: process.env.GOOGLE_CLOUD_PROJECT_ID || 'snappy-bucksaw-462516-t4',
        keyFilename: process.env.GOOGLE_CLOUD_KEY_FILE || './credentials/service-account-key.json',
      });
    } catch (error) {
      console.error('Failed to initialize Google Cloud Storage:', error);
      throw new Error('Google Cloud Storage initialization failed');
    }
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
      console.log('getUserImages: Starting for userId:', userId);
      
      const bucket = this.storage.bucket(this.bucketName);
      console.log('getUserImages: Got bucket reference:', this.bucketName);
      
      const [files] = await bucket.getFiles({
        prefix: `${userId}/`, // Only get files in the user's folder
      });
      
      console.log('getUserImages: Found files count:', files.length);
      
      const userImages = [];
      
      for (const file of files) {
        try {
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
        } catch (fileError) {
          console.warn('getUserImages: Error processing file', file.name, fileError);
          // Continue with other files
        }
      }
      
      console.log('getUserImages: Processed images count:', userImages.length);
      return userImages;
    } catch (error) {
      console.error('getUserImages: Error getting user images:', {
        error,
        userId,
        bucketName: this.bucketName,
        message: error instanceof Error ? error.message : 'Unknown error'
      });
      
      // Check if it's an authentication or bucket access issue
      if (error instanceof Error) {
        if (error.message.includes('404') || error.message.includes('not found')) {
          throw new Error(`Storage bucket '${this.bucketName}' not found. Please check configuration.`);
        } else if (error.message.includes('403') || error.message.includes('permission') || error.message.includes('forbidden')) {
          throw new Error('Insufficient permissions to access Google Cloud Storage. Please check service account permissions.');
        } else if (error.message.includes('authentication') || error.message.includes('credentials')) {
          throw new Error('Google Cloud Storage authentication failed. Please check service account credentials.');
        }
      }
      
      throw new Error(`Failed to get user images: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
      console.log('Fetching Doodle Snaps for user:', userId);
      
      // First check if the bucket exists and is accessible
      const bucket = this.storage.bucket(this.bucketName);
      try {
        await bucket.getMetadata();
        console.log('Bucket is accessible:', this.bucketName);
      } catch (bucketError) {
        console.error('Bucket access error:', bucketError);
        throw new Error(`Cannot access bucket '${this.bucketName}'. Please check permissions.`);
      }
      
      const allImages = await this.getUserImages(userId);
      console.log(`Found ${allImages.length} total images for user`);
      
      // Separate originals and doodles
      const originals = allImages.filter(img => img.metadata.isOriginal === 'true');
      const doodles = allImages.filter(img => img.metadata.isOriginal === 'false');
      
      console.log(`Found ${originals.length} originals and ${doodles.length} doodles`);
      
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
          } else {
            console.warn(`No original found for doodle with parentImageId: ${doodle.metadata.parentImageId}`);
          }
        }
      }
      
      // Sort by doodle creation date (newest first)
      projects.sort((a, b) => {
        const dateA = new Date(a.doodle.metadata.uploadedAt || 0).getTime();
        const dateB = new Date(b.doodle.metadata.uploadedAt || 0).getTime();
        return dateB - dateA;
      });
      
      console.log(`Returning ${projects.length} Doodle Snaps projects`);
      return projects;
    } catch (error) {
      console.error('Detailed error getting user Doodle Snaps:', {
        error,
        userId,
        bucketName: this.bucketName,
        projectId: process.env.GOOGLE_CLOUD_PROJECT_ID || 'snappy-bucksaw-462516-t4',
        keyFile: process.env.GOOGLE_CLOUD_KEY_FILE || './credentials/service-account-key.json'
      });
      
      if (error instanceof Error) {
        throw new Error(`Failed to get user Doodle Snaps: ${error.message}`);
      } else {
        throw new Error('Failed to get user Doodle Snaps: Unknown error');
      }
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
