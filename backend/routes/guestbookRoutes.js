import express from 'express';
import {
  getGuestbookEntries,
  createGuestbookEntry,
} from '../controllers/guestbookController.js';

const router = express.Router();

// Chain GET and POST for the same endpoint
router.route('/').get(getGuestbookEntries).post(createGuestbookEntry);

export default router;