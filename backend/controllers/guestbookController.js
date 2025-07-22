import GuestbookEntry from '../models/GuestbookEntry.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @desc    Get all guestbook entries
 * @route   GET /api/guestbook
 * @access  Public
 */
export const getGuestbookEntries = asyncHandler(async (req, res) => {
  const entries = await GuestbookEntry.find({}).sort({ timestamp: -1 });
  res.json(entries);
});

/**
 * @desc    Add a new guestbook entry
 * @route   POST /api/guestbook
 * @access  Public
 */
export const createGuestbookEntry = asyncHandler(async (req, res) => {
  const { name, message } = req.body;

  if (!message || message.trim() === '') {
    res.status(400);
    throw new Error('A message is required to sign the guestbook.');
  }

  const entry = await GuestbookEntry.create({
    name: name || 'Anonymous',
    message,
  });

  res.status(201).json(entry);
});