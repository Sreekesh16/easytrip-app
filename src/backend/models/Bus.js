const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
  type: String,
  registrationNumber: { type: String, unique: true },
  capacity: Number,
  amenities: [String],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('BusModel', busSchema);