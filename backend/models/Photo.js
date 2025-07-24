import mongoose from 'mongoose';

/**
 * Schema for storing metadata about uploaded photos and videos.
 * The 'approved' field is critical for the moderation feature.
 */
const photoSchema = new mongoose.Schema({
  // For backward compatibility, keep filename/filepath/mimetype as the 'main' (webp) version
  filename: { type: String, required: true },
  filepath: { type: String, required: true },
  mimetype: { type: String, required: true },
  // New fields for dual-format support
  webpPath: { type: String },
  webpMimetype: { type: String },
  jpegPath: { type: String },
  jpegMimetype: { type: String },
  uploadedBy: { type: String, default: 'Anonymous Guest' },
  approved: { type: Boolean, default: false, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Photo = mongoose.model('Photo', photoSchema);

export default Photo;