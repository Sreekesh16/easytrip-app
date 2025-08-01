const Schedule = require('../models/ScheduleModel');
const Bus = require('../models/BusModel');
const Driver = require('../models/DriverModel');
const mongoose = require('mongoose');


const toNumber = (value) => {
    if (value === undefined || value === null || value === '') {
        return undefined; 
    }
    const num = Number(value);
    return isNaN(num) ? undefined : num; 
};

const toDate = (value) => {
    if (value === undefined || value === null || value === '') {
        return undefined;
    }
    const date = new Date(value);
    return isNaN(date.getTime()) ? undefined : date; 
};

exports.getAllSchedules = async (req, res) => {
    try {
        const schedules = await Schedule.find()

        res.status(200).json({
            status: 'success',
            results: schedules.length,
            data: {
                schedules
            }
        });
    } catch (err) {
        console.error('Error fetching all schedules:', err.message);
        res.status(500).json({
            status: 'error',
            message: err.message
        });
    }
};

exports.getSchedule = async (req, res) => {
    try {
        const schedule = await Schedule.findById(req.params.id)

        if (!schedule) {
            return res.status(404).json({
                status: 'fail',
                message: 'Schedule not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                schedule
            }
        });
    } catch (err) {
        console.error('Error getting schedule:', err.message);
        res.status(500).json({
            status: 'error',
            message: err.message
        });
    }
};

exports.createSchedule = async (req, res) => {
    try {
        const busId = req.body.bus.id; 
        const driverId = req.body.driver.driverId; 
        const scheduleId = req.body.id; 

        if (!scheduleId) {
            return res.status(400).json({ status: 'fail', message: 'Schedule ID is required.' });
        }
        if (!busId) {
            return res.status(400).json({ status: 'fail', message: 'Bus ID is required.' });
        }
        if (!driverId) {
            return res.status(400).json({ status: 'fail', message: 'Driver ID is required.' });
        }



        const documentToInsert = {
            id: scheduleId, 
            ...req.body, 
            };
        const result = await Schedule.collection.insertOne(documentToInsert);

        if (!result.acknowledged || !result.insertedId) {
            throw new Error('Schedule document insertion not acknowledged or _id not returned.');
        }

        let newSchedule = await Schedule.findById(result.insertedId)
                                        .lean(); 

        if (!newSchedule) {
            throw new Error('Newly inserted schedule not found after retrieval.');
        }
        res.status(201).json({
            status: 'success',
            data: {
                schedule: newSchedule
            }
        });

    } catch (err) {
        console.error('--- ERROR CREATING SCHEDULE ---');
        console.error('Frontend sent:', JSON.stringify(req.body, null, 2));
        console.error('Mongoose/MongoDB Error Name:', err.name);
        console.error('Mongoose/MongoDB Error Code:', err.code);
        console.error('Mongoose/MongoDB Error Message:', err.message);

        if (err.code === 11000) {
            console.error('Duplicate Key Error:', err.keyValue);
            return res.status(409).json({
                status: 'fail',
                message: `Duplicate field value: '${Object.keys(err.keyValue)[0]}' already exists. Please use another value.`,
                field: Object.keys(err.keyValue)[0]
            });
        }

        if (err.name === 'ValidationError') { 
            const errors = Object.values(err.errors).map(el => el.message);
            return res.status(400).json({
                status: 'fail',
                message: 'Validation failed',
                errors: errors
            });
        }

        console.error('Unhandled Error Stack:', err.stack);
        res.status(500).json({
            status: 'error',
            message: 'Failed to create schedule due to an unexpected server error.',
            detailedError: process.env.NODE_ENV !== 'production' ? err.message : undefined
        });
    }
};


exports.updateSchedule = async (req, res) => {
    try {
        const scheduleId = req.params.id;
        const updateOperations = { $set: {} };

        if (req.body.bus !== undefined) {
            const busExists = await Bus.findOne({id:req.body.bus.id});
            if (!busExists && req.body.bus !== null) { 
                return res.status(404).json({ status: 'fail', message: 'Bus not found for update.' });
            }
            updateOperations.$set.bus = req.body.bus;
        }

        if (req.body.driver !== undefined) {
            const driverExists = await Driver.findOne({driverId:req.body.driver.driverId});
            if (!driverExists && req.body.driver !== null) { // Allow setting to null if schema permits
                return res.status(404).json({ status: 'fail', message: 'Driver not found for update.' });
            }
            updateOperations.$set.driver = req.body.driver;
        }

        if (req.body.status !== undefined) {
            updateOperations.$set.status = req.body.status;
        }

        if (req.body.route !== undefined) {
            if (req.body.route === null) {
                updateOperations.$set['route'] = null; // Or an empty object if required fields are an issue
            } else if (typeof req.body.route === 'object') {
                if (req.body.route.from !== undefined) updateOperations.$set['route.from'] = req.body.route.from;
                if (req.body.route.to !== undefined) updateOperations.$set['route.to'] = req.body.route.to;
                if (req.body.route.distance !== undefined) updateOperations.$set['route.distance'] = toNumber(req.body.route.distance);
                if (req.body.route.duration !== undefined) updateOperations.$set['route.duration'] = req.body.route.duration;
                if (req.body.route.description !== undefined) updateOperations.$set['route.description'] = req.body.route.description;
            }
        }

        if (req.body.timings !== undefined) {
            if (req.body.timings === null) {
                updateOperations.$set['timings'] = null;
            } else if (typeof req.body.timings === 'object') {
                if (req.body.timings.departure !== undefined) updateOperations.$set['timings.departure'] = toDate(req.body.timings.departure);
                if (req.body.timings.arrival !== undefined) updateOperations.$set['timings.arrival'] = toDate(req.body.timings.arrival);
            }
        }


        if (req.body.stops !== undefined) {
            if (req.body.stops === null) {
                updateOperations.$set['stops'] = null;
            } else if (typeof req.body.stops === 'object') {

                if (Array.isArray(req.body.stops.via)) {
                    updateOperations.$set['stops.via'] = req.body.stops.via.map(stop => ({
                        city: stop.city,
                        duration: stop.duration
                    }));
                } else if (req.body.stops.via === null) {
                    updateOperations.$set['stops.via'] = [];
                }

                if (Array.isArray(req.body.stops.pickupPoints)) {
                    updateOperations.$set['stops.pickupPoints'] = req.body.stops.pickupPoints.map(point => ({
                        location: point.location,
                        time: point.time,
                        address: point.address,
                        coordinates: {
                            lat: toNumber(point.coordinates?.lat),
                            lng: toNumber(point.coordinates?.lng)
                        }
                    }));
                } else if (req.body.stops.pickupPoints === null) {
                    updateOperations.$set['stops.pickupPoints'] = [];
                }

                if (Array.isArray(req.body.stops.dropPoints)) {
                    updateOperations.$set['stops.dropPoints'] = req.body.stops.dropPoints.map(point => ({
                        location: point.location,
                        time: point.time,
                        address: point.address,
                        coordinates: {
                            lat: toNumber(point.coordinates?.lat),
                            lng: toNumber(point.coordinates?.lng)
                        }
                    }));
                } else if (req.body.stops.dropPoints === null) {
                    updateOperations.$set['stops.dropPoints'] = [];
                }
            }
        }

        if (req.body.pricing !== undefined) {
            if (req.body.pricing === null) {
                updateOperations.$set['pricing'] = null;
            } else if (typeof req.body.pricing === 'object') {
                if (req.body.pricing.baseFare !== undefined) updateOperations.$set['pricing.baseFare'] = toNumber(req.body.pricing.baseFare);
                if (req.body.pricing.tax !== undefined) updateOperations.$set['pricing.tax'] = toNumber(req.body.pricing.tax);
                if (req.body.pricing.total !== undefined) updateOperations.$set['pricing.total'] = toNumber(req.body.pricing.total);
                if (req.body.pricing.currency !== undefined) updateOperations.$set['pricing.currency'] = req.body.pricing.currency;

                if (Array.isArray(req.body.pricing.discounts)) {
                    updateOperations.$set['pricing.discounts'] = req.body.pricing.discounts.map(discount => ({
                        type: discount.type,
                        amount: toNumber(discount.amount),
                        minDays: toNumber(discount.minDays),
                        idRequired: discount.idRequired,
                        minPassengers: toNumber(discount.minPassengers)
                    }));
                } else if (req.body.pricing.discounts === null) {
                    updateOperations.$set['pricing.discounts'] = [];
                }

                if (req.body.pricing.cancellationPolicy !== undefined) {
                    if (req.body.pricing.cancellationPolicy === null) {
                        updateOperations.$set['pricing.cancellationPolicy'] = null;
                    } else if (typeof req.body.pricing.cancellationPolicy === 'object') {
                        if (req.body.pricing.cancellationPolicy.before24hrs !== undefined) updateOperations.$set['pricing.cancellationPolicy.before24hrs'] = req.body.pricing.cancellationPolicy.before24hrs;
                        if (req.body.pricing.cancellationPolicy.within24hrs !== undefined) updateOperations.$set['pricing.cancellationPolicy.within24hrs'] = req.body.pricing.cancellationPolicy.within24hrs;
                        if (req.body.pricing.cancellationPolicy.noShow !== undefined) updateOperations.$set['pricing.cancellationPolicy.noShow'] = req.body.pricing.cancellationPolicy.noShow;
                    }
                }
            }
        }

        if (req.body.availability !== undefined) {
            if (req.body.availability === null) {
                updateOperations.$set['availability'] = null;
            } else if (typeof req.body.availability === 'object') {
                if (req.body.availability.totalSeats !== undefined) updateOperations.$set['availability.totalSeats'] = toNumber(req.body.availability.totalSeats);
                if (req.body.availability.availableSeats !== undefined) updateOperations.$set['availability.availableSeats'] = toNumber(req.body.availability.availableSeats);
                if (req.body.availability.lastUpdated !== undefined) updateOperations.$set['availability.lastUpdated'] = toDate(req.body.availability.lastUpdated);
            }
        }

        if (Object.keys(updateOperations.$set).length === 0) {
            delete updateOperations.$set;
        }

        if (Object.keys(updateOperations).length === 0) {
            const currentSchedule = await Schedule.findById(scheduleId)('bus').populate('driver');
            return res.status(200).json({
                status: 'success',
                message: 'No valid fields provided for update.',
                data: { schedule: currentSchedule }
            });
        }
        const schedule = await Schedule.findOneAndUpdate(
              { id: scheduleId },
            updateOperations,
            {
                new: true, 
                runValidators: true, 
                lean: true 
            }
        ).lean();

        if (!schedule) {
            return res.status(404).json({
                status: 'fail',
                message: 'No schedule found with that ID'
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                schedule
            }
        });

    } catch (err) {
        console.error('Update error:', err);

        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map(el => el.message);
            return res.status(400).json({
                status: 'fail',
                message: 'Validation failed',
                errors: errors
            });
        }

        if (err.code === 11000) {
            const field = Object.keys(err.keyValue)[0];
            return res.status(409).json({
                status: 'fail',
                message: `Duplicate ${field}: '${err.keyValue[field]}' already exists`
            });
        }

        res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
};

exports.deleteSchedule = async (req, res) => {
    try {
        const schedule = await Schedule.findOneAndDelete({id:req.params.id});

        if (!schedule) {
            return res.status(404).json({
                status: 'fail',
                message: 'Schedule not found'
            });
        }

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        console.error('Error deleting schedule:', err.message);
        res.status(500).json({
            status: 'error',
            message: err.message
        });
    }
};