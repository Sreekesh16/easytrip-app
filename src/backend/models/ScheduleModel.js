const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema(
    {
        'id':{type:String,required:true},
        'route.from': { type: String, required: true },
        'route.to': { type: String, required: true },
        'route.distance': Number,
        'route.duration': String,
        'route.description': String,

        'timings.departure': { type: Date, required: true },
        'timings.arrival': { type: Date, required: true },

        'bus.id':{type:String,required:true},
        'bus.type':{type:String,required:true},
        'bus.registrationNumber':{type:String,required:true},
        'bus.amenities':[{
            type:String
        }],
        'bus.features':{
            hasWifi:Boolean,
            hasToilet:Boolean,
            isDoubleDecker:Boolean
        },

        'stops.via': [{ 
            city: String,
            duration: String
        }],
        'stops.pickupPoints': [{ 
            location: String,
            time: String,
            address: String,
            coordinates: {
                lat: Number,
                lng: Number
            }
        }],
        'stops.dropPoints': [{ 
            location: String,
            time: String,
            address: String,
            coordinates: {
                lat: Number,
                lng: Number
            }
        }],

        'pricing.baseFare': { type: Number, required: true },
        'pricing.tax': Number,
        'pricing.discounts': [{ 
            type: String,
            amount: Number,
            minDays: Number,
            idRequired: Boolean,
            minPassengers: Number
        }],
        'pricing.total': { type: Number, required: true },
        'pricing.currency': { type: String, default: 'INR' },
        'pricing.cancellationPolicy': { 
            before24hrs: String,
            within24hrs: String,
            noShow: String
        },

        'availability.totalSeats': { type: Number, required: true },
        'availability.availableSeats': { type: Number, required: true },
        'availability.lastUpdated': { type: Date, default: Date.now },


        status: {
            type: String,
            enum: ['scheduled', 'completed', 'cancelled', 'delayed'],
            default: 'scheduled'
        },
        'driver.driverId':{type:String,required:true},
        'driver.name':{type:String,required:true},
        'driver.mobile':{type:String,required:true},
        'driver.licenseNumber':{type:String,required:true},
        'driver.licenseExpiry':{type:String},
        'driver.gender':{type:String},
        'driver.address.street':{type:String},
        'driver.address.city':{type:String},
        'driver.address.state':{type:String},
        'driver.address.pincode':{type:String},
        'driver.dateOfBirth':{type:String},
        'driver.bloodGroup':{type:String},
        'driver.emergencyContact.name':{type:String},
        'driver.emergencyContact.relation':{type:String},
        'driver.emergencyContact.mobile':{type:String},
        'driver.joiningDate': {type:String},
        'driver.experienceYears': {type:String},
        'driver.status':  {type:String},
        'driver.availableTimings.weekdays': [{ start:{type:String} ,end: {type:String} }],
        'driver.availableTimings.weekends': [{ start:{type:String} ,end: {type:String} }],

        'driver.assignedSchedules': [{type:String}],
         'driver.rating': Number,
        'driver.totalTripsCompleted': Number,
    },
    {
        timestamps: true, 
        strict: true,   
        strictQuery: true 
    }
);



module.exports = mongoose.model('ScheduleModel', scheduleSchema);