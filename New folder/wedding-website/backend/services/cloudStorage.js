
import { Storage } from '@google-cloud/storage';
import winston from 'winston';

// Centralized logger setup
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.simple()
  ),
  transports: [
    new winston.transports.Console(),
    // Optionally add file/cloud transports here
  ],
});

// Initialize Google Cloud Storage
const storage = new Storage();



class CloudStorageService {
  constructor() {
    this.bucketName = process.env.GCS_BUCKET_NAME;
    if (!this.bucketName) {
      throw new Error('GCS_BUCKET_NAME environment variable is required');
    }
    this.bucket = storage.bucket(this.bucketName);
    this.maxRetries = 3;
    this.allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.mp4', '.mov', '.pdf'];
    this.allowedMimeTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'video/mp4', 'video/quicktime', 'application/pdf'
    ];
    this.maxBatchConcurrency = 5;
  }

  // Utility: sanitize filename (prevent path traversal)
  sanitizeFilename(filename) {
    return filename.replace(/[^a-zA-Z0-9._-]/g, '_');
  }

  // Utility: validate file extension and MIME type
  validateFileType(filename, contentType) {
    const ext = (filename && filename.lastIndexOf('.') !== -1)
      ? filename.slice(filename.lastIndexOf('.')).toLowerCase() : '';
    if (!this.allowedExtensions.includes(ext) || !this.allowedMimeTypes.includes(contentType)) {
      throw new Error('File type not allowed');
    }
  }

  /**
   * Generate a signed URL for uploading a file
   * @param {string} filename - Name of the file to upload
   * @param {string} contentType - MIME type of the file
   * @returns {Promise<string>} Signed upload URL
   */
  /**
   * Generate a signed URL for uploading a file
   * @param {string} filename - Name of the file to upload
   * @param {string} contentType - MIME type of the file
   * @param {number} [expiresIn=900] - Expiration in seconds (default 15 min)
   * @returns {Promise<string>} Signed upload URL
   */
  async generateSignedUploadUrl(filename, contentType, expiresIn = 900) {
    if (!filename || !contentType) throw new Error('Filename and contentType required');
    this.validateFileType(filename, contentType);
    const safeFilename = this.sanitizeFilename(filename);
    const options = {
      version: 'v4',
      action: 'write',
      expires: Date.now() + expiresIn * 1000,
      contentType,
    };
    return this._withRetry(async () => {
      const [signedUrl] = await this.bucket.file(safeFilename).getSignedUrl(options);
      return signedUrl;
    }, 'generateSignedUploadUrl');
  }

  /**
   * Generate a signed URL for reading a file
   * @param {string} filename - Name of the file to read
   * @returns {Promise<string>} Signed read URL
   */
  /**
   * Generate a signed URL for reading a file
   * @param {string} filename - Name of the file to read
   * @param {number} [expiresIn=3600] - Expiration in seconds (default 1 hour)
   * @returns {Promise<string>} Signed read URL
   */
  async generateSignedReadUrl(filename, expiresIn = 3600) {
    if (!filename) throw new Error('Filename required');
    const safeFilename = this.sanitizeFilename(filename);
    const options = {
      version: 'v4',
      action: 'read',
      expires: Date.now() + expiresIn * 1000,
    };
    return this._withRetry(async () => {
      const [signedUrl] = await this.bucket.file(safeFilename).getSignedUrl(options);
      return signedUrl;
    }, 'generateSignedReadUrl');
  }

  /**
   * Delete a file from the bucket
   * @param {string} filename - Name of the file to delete
   */
  async deleteFile(filename) {
    if (!filename) throw new Error('Filename required');
    const safeFilename = this.sanitizeFilename(filename);
    return this._withRetry(async () => {
      await this.bucket.file(safeFilename).delete();
      logger.info(`File ${safeFilename} deleted successfully`);
    }, 'deleteFile');
  }

  /**
   * Check if a file exists in the bucket
   * @param {string} filename - Name of the file to check
   * @returns {Promise<boolean>} True if file exists
   */
  async fileExists(filename) {
    if (!filename) return false;
    const safeFilename = this.sanitizeFilename(filename);
    return this._withRetry(async () => {
      const [exists] = await this.bucket.file(safeFilename).exists();
      return exists;
    }, 'fileExists', false);
  }

  /**
   * List files in the bucket (optionally with prefix)
   * @param {string} [prefix] - Optional prefix to filter files
   * @param {number} [maxResults=100] - Max number of files to return
   * @returns {Promise<Array>} List of file metadata
   */
  async listFiles(prefix = '', maxResults = 100) {
    const safePrefix = prefix ? this.sanitizeFilename(prefix) : '';
    return this._withRetry(async () => {
      const [files] = await this.bucket.getFiles({ prefix: safePrefix, maxResults });
      return files.map(f => ({
        name: f.name,
        size: f.metadata.size,
        contentType: f.metadata.contentType,
        updated: f.metadata.updated,
        url: `https://storage.googleapis.com/${this.bucketName}/${f.name}`
      }));
    }, 'listFiles', []);
  }

  /**
   * Batch delete files (with concurrency limit)
   * @param {string[]} filenames
   * @returns {Promise<Array>} results per file
   */
  async batchDeleteFiles(filenames = []) {
    if (!Array.isArray(filenames) || filenames.length === 0) return [];
    const results = [];
    let idx = 0;
    const next = async () => {
      if (idx >= filenames.length) return;
      const filename = filenames[idx++];
      try {
        await this.deleteFile(filename);
        results.push({ filename, status: 'deleted' });
      } catch (err) {
        results.push({ filename, status: 'error', error: err.message });
      }
      await next();
    };
    // Run up to maxBatchConcurrency in parallel
    await Promise.all(Array(this.maxBatchConcurrency).fill(0).map(() => next()));
    return results;
  }

  /**
   * Retry wrapper for transient errors
   * @param {Function} fn - Async function to execute
   * @param {string} opName - Operation name for logging
   * @param {*} defaultValue - Value to return if all retries fail (optional)
   */
  async _withRetry(fn, opName, defaultValue) {
    let attempt = 0;
    while (attempt < this.maxRetries) {
      try {
        return await fn();
      } catch (error) {
        attempt++;
        const isTransient = error.code && [500, 502, 503, 504].includes(error.code);
        logger.error(`[${opName}] Attempt ${attempt} failed: ${error.message}`, { code: error.code, stack: error.stack });
        if (!isTransient || attempt >= this.maxRetries) {
          if (defaultValue !== undefined) return defaultValue;
          throw new Error(`Failed to ${opName}: ${error.message}`);
        }
        // Exponential backoff
        await new Promise(res => setTimeout(res, 200 * Math.pow(2, attempt)));
      }
    }
  }
}

export default new CloudStorageService();
