import mongoose from 'mongoose';

const guestbookEntrySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: 'Anonymous',
  },
  message: {
    type: String,
    required: [true, 'A message is required to sign the guestbook.'],
    trim: true,
    maxlength: [500, 'Message cannot exceed 500 characters.'],
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const GuestbookEntry = mongoose.model('GuestbookEntry', guestbookEntrySchema);

export default GuestbookEntry;