



    const mongoose = require('mongoose');

    const bookingSchema = new mongoose.Schema(
        {
            'id': { type: String, required: true },
            'user.id': { type: String, required: true },
            'user.name': { type: String, required: true },
            'user.email': { type: String, required: true },
            'user.phone': { type: String, required: true },
            'user.address.street': String,
            'user.address.city': String,
            'user.address.state': String,
            'user.address.pincode': String,
            'user.address.coordinates.lat': Number,
            'user.address.coordinates.lng': Number,
            'schedule.id': { type: String, required: true },
            'schedule.from.city': String,
            'schedule.from.terminal': String,
            'schedule.from.departure': String,
            'schedule.to.city': String,
            'schedule.to.terminal': String,
            'schedule.to.arrival': String,
            'schedule.bus.id': String,
            'schedule.bus.type': String,
            'schedule.bus.amenities': [String],
            'schedule.via': [{
                city: String,
                stopDuration: Number
            }],
            'schedule.distance': Number,
            'schedule.duration': String,
            seat:[String],
            passengerDetails: [{
                name: { type: String, required: true },
                age: Number,
                gender: String,
            }],
            'bookingDetails.date': { type: Date, required: true },
            'bookingDetails.travelDate': { type: Date, required: true },
            'bookingDetails.confirmationNumber': String,
            'fareDetails.baseFare': { type: Number, required: true },
            'fareDetails.tax': Number,
            'fareDetails.discount.code': String,
            'fareDetails.discount.amount': Number,

            'fareDetails.surcharges': [{
                    type: { type: String, required: true },
                    amount: { type: Number, required: true }
                }]
                ,
            'fareDetails.total': { type: Number, required: true },
            'fareDetails.currency': { type: String, default: 'INR' },
            'fareDetails.paymentBreakdown.paid': Number,
            'fareDetails.paymentBreakdown.due': Number,
            'fareDetails.paymentBreakdown.refunded': Number,
            'payment.method': { type: String, required: true },
            'payment.transactionId': String,
            'payment.cardLast4': String,
            'payment.status': String,
            'payment.timestamp': Date,
            'payment.gateway': String,
            'locations.pickup.point': String,
            'locations.pickup.time': String,
            'locations.pickup.address': String,
            'locations.pickup.contact.name': String,
            'locations.pickup.contact.phone': String,
            'locations.pickup.coordinates.lat': Number,
            'locations.pickup.coordinates.lng': Number,
            'locations.drop.point': String,
            'locations.drop.time': String,
            'locations.drop.address': String,
            'locations.drop.contact.name': String,
            'locations.drop.contact.phone': String,
            'locations.drop.coordinates.lat': Number,
            'locations.drop.coordinates.lng': Number,
            'status.current': { type: String, required: true },
            'status.history': [{
                state: String,
                timestamp: Date
            }],
            'cancellation.reason': String,
            'cancellation.requestedBy': String,
            'cancellation.timestamp': Date,
            'cancellation.refundAmount': Number,
            'cancellation.status': String,
            'rating.overall': Number,
            'rating.categories.driver': Number,
            'rating.categories.cleanliness': Number,
            'rating.categories.comfort': Number,
            'rating.categories.punctuality': Number,
            'rating.comment': String,
            'rating.submittedAt': Date,
            'rating.photos': [String],
            'services.insurance.opted': Boolean,
            'services.insurance.provider': String,
            'services.insurance.amount': Number,
            'services.meals.opted': Boolean,
            'services.meals.items': [{
                name: String,
                price: Number
            }]
        },
        {
            timestamps: true,
            strict: true,
            strictQuery: true
        }
    );

    module.exports = mongoose.model('BookingModel', bookingSchema);