import express from 'express';
import { streamVideo } from '../controllers/videoController.js';

const router = express.Router();

router.route('/').get(streamVideo);

export default router;