import mongoose from 'mongoose';

/**
 * Schema for storing metadata about uploaded photos and videos.
 * The 'approved' field is critical for the moderation feature.
 */
const photoSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  filepath: {
    type: String,
    required: true,
  },
  mimetype: {
    type: String,
    required: true,
  },
  uploadedBy: {
    type: String,
    default: 'Anonymous Guest',
  },
  approved: {
    type: Boolean,
    default: false, // All uploads start as unapproved.
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Photo = mongoose.model('Photo', photoSchema);

export default Photo;