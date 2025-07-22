import mongoose from 'mongoose';

const visitorLogSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now,
  },
  // You can add more fields here later, like IP address, user agent, etc.
});

const VisitorLog = mongoose.model('VisitorLog', visitorLogSchema);

export default VisitorLog;