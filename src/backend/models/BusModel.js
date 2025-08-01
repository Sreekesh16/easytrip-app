const mongoose = require('mongoose');
const busSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            uppercase: true
        },
        registrationNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            uppercase: true
        },
        type: {
            type: String,
            required: true,
            enum: ['AC Sleeper', 'Non AC Seater', 'AC Seater', 'Non AC Sleeper', 'Premium']
        },
        totalSeats: {
            type: Number,
            required: true,
            min: 1
        },

        berthStructure: {
            lower: { type: Number, required: true },
            upper: Number,
            layout: [String]
        },
        amenities: {
            type: [String],
            enum: [
                'AC', 'Charging Ports', 'Blankets', 'Water Bottle',
                'Pillow', 'WiFi', 'TV', 'Snacks', 'Premium',
                'Compact', 'Toilet', 'DoubleDecker'
            ]
        },
        status: {
            type: String,
            enum: ['available', 'maintenance', 'unavailable'],
            default: 'available'
        },
        features: {
            hasWifi: { type: Boolean, default: false },
            hasToilet: { type: Boolean, default: false },
            isDoubleDecker: { type: Boolean, default: false },
            isPremium: { type: Boolean, default: false }
        },
        maintenanceHistory: [{ 
            date: { type: Date, required: true },
            type: { type: String, required: true },
            notes: String,
            mileage: Number,
            cost: Number,
            technician: String
        }],
        lastServiceDate: Date,
        nextServiceDue: Date,
        isActive: { type: Boolean, default: true }
    },
    {
        timestamps: true,
        strict: true,
        strictQuery: true
    }
);

busSchema.path('berthStructure', { _id: false });
busSchema.path('features', { _id: false });
busSchema.path('maintenanceHistory',{_id:false})

module.exports = mongoose.models.Bus || mongoose.model('Bus', busSchema);