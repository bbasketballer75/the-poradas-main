import asyncHandler from '../utils/asyncHandler.js';
import cloudStorage from '../services/cloudStorage.js';
import winston from 'winston';

/**
 * @desc    Stream the main wedding video with support for range requests
 * @route   GET /api/video
 * @access  Public
 */
export const streamVideo = asyncHandler(async (req, res) => {
  // Configurable GCS path for the wedding video
  const gcsPath = process.env.WEDDING_VIDEO_GCS_PATH || 'videos/wedding_video.mp4';
  const range = req.headers.range;
  const file = cloudStorage.bucket.file(gcsPath);
  const [metadata] = await file.getMetadata();
  const fileSize = parseInt(metadata.size, 10);
  if (!fileSize) {
    res.status(404);
    throw new Error('Video file not found in GCS.');
  }
  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = end - start + 1;
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(206, head);
    file.createReadStream({ start, end }).pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(200, head);
    file.createReadStream().pipe(res);
  }
});