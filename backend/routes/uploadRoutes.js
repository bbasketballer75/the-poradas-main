import express from 'express';
import cloudStorage from '../services/cloudStorage.js';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

const router = express.Router();

/**
 * @swagger
 * /api/upload/signed-url:
 *   post:
 *     summary: Generate a signed URL for file upload
 *     tags: [Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - filename
 *               - contentType
 *             properties:
 *               filename:
 *                 type: string
 *                 description: Original filename
 *               contentType:
 *                 type: string
 *                 description: MIME type of the file
 *     responses:
 *       200:
 *         description: Signed URL generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 uploadUrl:
 *                   type: string
 *                   description: Signed URL for uploading
 *                 filename:
 *                   type: string
 *                   description: Generated filename to use
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post('/signed-url', async (req, res) => {
  try {
    const { filename, contentType } = req.body;

    if (!filename || !contentType) {
      return res.status(400).json({ 
        error: 'Filename and contentType are required' 
      });
    }

    // Generate unique filename to prevent conflicts
    const ext = path.extname(filename);
    const uniqueFilename = `${uuidv4()}${ext}`;

    // Generate signed upload URL
    const uploadUrl = await cloudStorage.generateSignedUploadUrl(
      uniqueFilename, 
      contentType
    );

    res.json({
      uploadUrl,
      filename: uniqueFilename
    });
  } catch (error) {
    console.error('Error generating signed URL:', error);
    res.status(500).json({ error: 'Failed to generate upload URL' });
  }
});

/**
 * @swagger
 * /api/upload/file-url/{filename}:
 *   get:
 *     summary: Get a signed URL for accessing an uploaded file
 *     tags: [Upload]
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *         description: Name of the file
 *     responses:
 *       200:
 *         description: Signed URL for file access
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 fileUrl:
 *                   type: string
 *                   description: Signed URL for accessing the file
 *       404:
 *         description: File not found
 *       500:
 *         description: Server error
 */
router.get('/file-url/:filename', async (req, res) => {
  try {
    const { filename } = req.params;

    // Check if file exists
    const exists = await cloudStorage.fileExists(filename);
    if (!exists) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Generate signed read URL
    const fileUrl = await cloudStorage.generateSignedReadUrl(filename);

    res.json({ fileUrl });
  } catch (error) {
    console.error('Error generating file URL:', error);
    res.status(500).json({ error: 'Failed to generate file URL' });
  }
});

/**
 * @swagger
 * /api/upload/delete/{filename}:
 *   delete:
 *     summary: Delete an uploaded file
 *     tags: [Upload]
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *         description: Name of the file to delete
 *     responses:
 *       200:
 *         description: File deleted successfully
 *       404:
 *         description: File not found
 *       500:
 *         description: Server error
 */
router.delete('/delete/:filename', async (req, res) => {
  try {
    const { filename } = req.params;

    // Check if file exists
    const exists = await cloudStorage.fileExists(filename);
    if (!exists) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Delete the file
    await cloudStorage.deleteFile(filename);

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

export default router;
