import GuestbookEntry from '../models/GuestbookEntry.js';
import asyncHandler from '../utils/asyncHandler.js';
import Joi from 'joi';

/**
 * @desc    Get all guestbook entries
 * @route   GET /api/guestbook
 * @access  Public
 */
export const getGuestbookEntries = asyncHandler(async (req, res) => {
  const entries = await GuestbookEntry.find({}).sort({ timestamp: -1 });
  res.json(entries);
});

// Define a validation schema
const guestbookSchema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    message: Joi.string().min(5).max(500).required()
});

/**
 * @desc    Add a new guestbook entry
 * @route   POST /api/guestbook
 * @access  Public
 */
export const createGuestbookEntry = asyncHandler(async (req, res) => {
  // Validate the request body
  const { error, value } = guestbookSchema.validate(req.body);
  if (error) {
      return res.status(400).json({ message: error.details[0].message });
  }

  // If validation passes, proceed to create the entry
  const entry = await GuestbookEntry.create(value);
  res.status(201).json(entry);
});