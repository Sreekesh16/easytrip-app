const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  joinDate: { type: Date, default: Date.now },
  gender: { type: String, enum: ['male', 'female', 'other'], required: true },
  
  // Address fields
  'address.street': { type: String },
  'address.city': { type: String },
  'address.state': { type: String },
  'address.pincode': { type: String },
  
  // Emergency contact
  'emergencyContact.name': { type: String },
  'emergencyContact.phone': { type: String },
  'emergencyContact.relation': { type: String },
  
  bookings: [{ type: String }],
  
  // Stats
  'stats.totalBookings': { type: Number, default: 0 },
  'stats.cancelledBookings': { type: Number, default: 0 },
  'stats.totalSpent': { type: Number, default: 0 },
  'stats.completedBookings': { type: Number, default: 0 },
  'stats.upcomingBookings': { type: Number, default: 0 },
  'stats.averageRating': { type: Number, default: null },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update timestamps
userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('UserModel', userSchema);