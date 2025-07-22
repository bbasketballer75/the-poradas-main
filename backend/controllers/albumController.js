import path from 'path';
import fs from 'fs/promises';
import os from 'os';
import sharp from 'sharp';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import Photo from '../models/Photo.js';

// Configure fluent-ffmpeg to use the binary from the npm package.
// This avoids the need for a manual ffmpeg installation on the server.
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const UPLOADS_DIR = 'uploads';

// Helper function to process a single file
const processFile = async (file) => {
  const { buffer, mimetype, originalname } = file;
  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  const extension = path.extname(originalname);
  const tempInputPath = path.join(os.tmpdir(), `media-input-${uniqueSuffix}${extension}`);
  let finalFilepath;
  let finalMimetype;

  try {
    if (mimetype.startsWith('image/')) {
      const filename = `img-${uniqueSuffix}.webp`;
      finalFilepath = path.join(UPLOADS_DIR, filename);
      finalMimetype = 'image/webp';

      await sharp(buffer)
        .resize({ width: 1920, height: 1080, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(finalFilepath);
    } else if (mimetype.startsWith('video/')) {
      const filename = `vid-${uniqueSuffix}.mp4`;
      finalFilepath = path.join(UPLOADS_DIR, filename);
      finalMimetype = 'video/mp4';

      await fs.writeFile(tempInputPath, buffer);

      await new Promise((resolve, reject) => {
        ffmpeg(tempInputPath)
          .outputOptions([
            '-c:v libx264', '-preset fast', '-crf 28',
            '-c:a aac', '-b:a 128k',
            '-movflags +faststart',
            '-vf scale=w=1280:h=720:force_original_aspect_ratio=decrease'
          ])
          .toFormat('mp4')
          .on('end', resolve)
          .on('error', (err) => reject(new Error(`FFmpeg failed: ${err.message}`)))
          .save(finalFilepath);
      });
    } else {
      throw new Error('Unsupported file type');
    }

    const newMedia = new Photo({
      filename: path.basename(finalFilepath),
      filepath: finalFilepath,
      mimetype: finalMimetype,
    });

    await newMedia.save();
    return { status: 'success', data: newMedia };
  } catch (error) {
    // If processing fails, attempt to clean up the created file
    if (finalFilepath) {
      await fs.unlink(finalFilepath).catch(e => console.error(`Failed to clean up file: ${finalFilepath}`, e));
    }
    // Return a structured error object
    return { status: 'error', originalname, message: error.message };
  } finally {
    // Always clean up the temporary input file
    await fs.unlink(tempInputPath).catch(e => console.error(`Failed to clean up temp file: ${tempInputPath}`, e));
  }
};

export const uploadMedia = async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'Please upload one or more files.' });
  }

  try {
    await fs.mkdir(UPLOADS_DIR, { recursive: true });

    const processingPromises = req.files.map(processFile);
    const results = await Promise.all(processingPromises);

    const uploadedFiles = results.filter(r => r.status === 'success').map(r => r.data);
    const errors = results.filter(r => r.status === 'error');

    if (errors.length > 0) {
      const status = uploadedFiles.length > 0 ? 207 : 400; // 207 Multi-Status
      return res.status(status).json({ 
        message: 'Some files were processed with errors.', 
        uploadedFiles, 
        errors 
      });
    }

    res.status(201).json({
      message: 'All files uploaded successfully and are pending review.',
      files: uploadedFiles,
    });

  } catch (error) {
    console.error('Unhandled error in uploadMedia:', error);
    res.status(500).json({ message: 'A server error occurred during file upload.', details: error.message });
  }
};

/**
 * Retrieves all approved media for the public gallery.
 */
export const getAlbumMedia = async (req, res) => {
  try {
    const media = await Photo.find({ approved: true }).sort({ createdAt: -1 });
    res.json(media);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching media.' });
  }
};

/**
 * Retrieves all media, including pending ones, for the admin dashboard.
 */
export const getAllAlbumMedia = async (req, res) => {
  try {
    const media = await Photo.find({}).sort({ createdAt: -1 });
    res.json(media);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching all media.' });
  }
};

/**
 * Approves or rejects a piece of media.
 */
export const moderateMedia = async (req, res) => {
  const { photoId, isApproved } = req.body;
  try {
    if (isApproved) {
      const photo = await Photo.findByIdAndUpdate(photoId, { approved: true }, { new: true });
      if (!photo) return res.status(404).json({ message: 'Photo not found.' });
      res.json({ message: 'Media has been approved.', photo });
    } else {
      const photo = await Photo.findByIdAndDelete(photoId);
      if (!photo) return res.status(404).json({ message: 'Photo not found.' });

      // After deleting the DB record, delete the physical file
      const filepath = path.join(UPLOADS_DIR, photo.filename);
      await fs.unlink(filepath).catch(e => console.error(`Failed to delete rejected file: ${filepath}`, e));

      res.json({ message: 'Media has been rejected and deleted.' });
    }
  } catch (error) {
    console.error('Error during moderation:', error);
    res.status(500).json({ message: 'Server error during moderation.' });
  }
};