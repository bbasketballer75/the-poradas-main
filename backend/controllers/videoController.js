import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @desc    Stream the main wedding video with support for range requests
 * @route   GET /api/video
 * @access  Public
 */
export const streamVideo = asyncHandler(async (req, res) => {
  // Get the directory name of the current module to reliably find the project root
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  // The project root is two levels up from backend/controllers
  const rootDir = path.join(__dirname, '..', '..');
  const videoPath = path.join(rootDir, 'public', 'videos', 'wedding_video.mp4');

  // Check if video file exists
  try {
    await fs.promises.access(videoPath);
  } catch (error) {
    res.status(404);
    throw new Error('Video file not found.');
  }

  const stat = fs.statSync(videoPath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = end - start + 1;

    const file = fs.createReadStream(videoPath, { start, end });
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    };

    res.writeHead(206, head); // 206 Partial Content
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(200, head);
    fs.createReadStream(videoPath).pipe(res);
  }
});