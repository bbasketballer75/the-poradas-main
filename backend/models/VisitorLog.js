import mongoose from 'mongoose';

const visitorLogSchema = new mongoose.Schema({
  ip_address: {
    type: String,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const VisitorLog = mongoose.model('VisitorLog', visitorLogSchema);

export default VisitorLog;