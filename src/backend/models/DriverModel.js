const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  driverId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  mobile: { type: String, required: true },
  licenseNumber: { type: String, required: true, unique: true },
  licenseExpiry: Date,
  gender: String,

  'address.street': { type: String },
  'address.city': { type: String },
  'address.state': { type: String },
  'address.pincode': { type: String },

  dateOfBirth: Date,
  bloodGroup: String,

  'emergencyContact.name': { type: String },
  'emergencyContact.relation': { type: String },
  'emergencyContact.mobile': { type: String },

  joiningDate: Date,
  experienceYears: Number,
  status: { type: String, default: 'active', enum: ['active', 'inactive', 'on leave'] },

  availableTimings: {
    weekdays: [{ type: String }],
    weekends: [{ type: String }]
  },

  assignedSchedules: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ScheduleModel' }], // Reference to ScheduleModel
  rating: { type: Number, default: 0 },
  totalTripsCompleted: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

driverSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('DriverModel', driverSchema);