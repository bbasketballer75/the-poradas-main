import { Storage } from '@google-cloud/storage';

// Initialize Google Cloud Storage
// When deployed on Cloud Run, credentials are automatically available
const storage = new Storage();

class CloudStorageService {
  constructor() {
    this.bucketName = process.env.GCS_BUCKET_NAME;
    if (!this.bucketName) {
      throw new Error('GCS_BUCKET_NAME environment variable is required');
    }
    this.bucket = storage.bucket(this.bucketName);
  }

  /**
   * Generate a signed URL for uploading a file
   * @param {string} filename - Name of the file to upload
   * @param {string} contentType - MIME type of the file
   * @returns {Promise<string>} Signed upload URL
   */
  async generateSignedUploadUrl(filename, contentType) {
    const options = {
      version: 'v4',
      action: 'write',
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
      contentType,
    };

    try {
      const [signedUrl] = await this.bucket.file(filename).getSignedUrl(options);
      return signedUrl;
    } catch (error) {
      console.error('Error generating signed URL:', error);
      throw new Error('Failed to generate upload URL');
    }
  }

  /**
   * Generate a signed URL for reading a file
   * @param {string} filename - Name of the file to read
   * @returns {Promise<string>} Signed read URL
   */
  async generateSignedReadUrl(filename) {
    const options = {
      version: 'v4',
      action: 'read',
      expires: Date.now() + 60 * 60 * 1000, // 1 hour
    };

    try {
      const [signedUrl] = await this.bucket.file(filename).getSignedUrl(options);
      return signedUrl;
    } catch (error) {
      console.error('Error generating signed read URL:', error);
      throw new Error('Failed to generate read URL');
    }
  }

  /**
   * Delete a file from the bucket
   * @param {string} filename - Name of the file to delete
   */
  async deleteFile(filename) {
    try {
      await this.bucket.file(filename).delete();
      console.log(`File ${filename} deleted successfully`);
    } catch (error) {
      console.error('Error deleting file:', error);
      throw new Error('Failed to delete file');
    }
  }

  /**
   * Check if a file exists in the bucket
   * @param {string} filename - Name of the file to check
   * @returns {Promise<boolean>} True if file exists
   */
  async fileExists(filename) {
    try {
      const [exists] = await this.bucket.file(filename).exists();
      return exists;
    } catch (error) {
      console.error('Error checking file existence:', error);
      return false;
    }
  }
}

export default new CloudStorageService();
