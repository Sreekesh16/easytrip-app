const User = require('../models/UserModel'); // Assuming your user schema is in userModel.js
const Driver = require('../models/DriverModel'); // Assuming your driver schema is in driverModel.js
const Booking = require('../models/BookingModel'); // You'll need a Booking model too
const Schedule = require('../models/ScheduleModel'); // You'll need a Schedule model too

const formatDate = (date, format = 'medium') => {
    if (!date) return null;
    return new Date(date).toISOString();
};

const calculateAverageRating = (userId) => {
    return Math.round((Math.random() * 1.5 + 3.5) * 10) / 10;
};

const ensureTimeRange = (t) => {
    if (typeof t === 'string') {
        const [start, end] = t.split('-');
        return { start, end };
    }
    return t;
};

const timeRangeToString = (timeRange) => {
    return `${timeRange.start}-${timeRange.end}`;
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().lean();
        const allBookingIds = users.flatMap(user => user.bookings || []);
        const bookings = await Booking.find({ id: { $in: allBookingIds } });
        const bookingMap = bookings.reduce((map, booking) => {
            map[booking.id] = booking;
            return map;
        }, {});
        const usersWithDetails = users.map(user => {
            const bookingDetails = (user.bookings || [])
                .map(bookingId => bookingMap[bookingId])
                .filter(booking => booking); // Filter out undefined

            // Calculate stats from the booking details
            const stats = {
                totalBookings: bookingDetails.length,
                cancelledBookings: bookingDetails.filter(b => b.status?.current === 'cancelled').length,
                totalSpent: bookingDetails.reduce((sum, b) => sum + (b.fareDetails?.total || 0), 0),
                completedBookings: bookingDetails.filter(b => b.status?.current === 'completed').length,
                upcomingBookings: bookingDetails.filter(b => b.status?.current === 'upcoming').length,
                averageRating: calculateAverageRating(user.id)
            };
            return {
                ...user,  // Keep original user data including the bookings array of strings
                bookingDetails,  // Add full booking objects in a new field
                stats
            };
        });


        res.status(200).json(usersWithDetails);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error fetching users with booking details', 
            error: error.message 
        });
    }
};

exports.getUserDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findOne({ id });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userBookings = await Booking.find({ 'user.id': id });

        // Calculate stats for the selected user
        const userStats = {
            totalBookings: userBookings.length,
            cancelledBookings: userBookings.filter(b => b.status?.current === 'cancelled').length,
            totalSpent: userBookings.reduce((sum, b) => sum + (b.fareDetails?.total || 0), 0),
            completedBookings: userBookings.filter(b => b.status?.current === 'completed').length,
            upcomingBookings: userBookings.filter(b => b.status?.current === 'upcoming').length,
            averageRating: calculateAverageRating(user.id)
        };

        res.status(200).json({ user: { ...user.toObject(), stats: userStats }, bookings: userBookings });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user details', error: error.message });
    }
};

// --- Driver Management ---

exports.getAllDrivers = async (req, res) => {
    try {
        const drivers = await Driver.find();
        // Ensure availableTimings are in the correct TimeRange format (objects)
        const formattedDrivers = drivers.map(driver => ({
            ...driver.toObject(),
            availableTimings: {
                weekdays: driver.availableTimings.weekdays.map(t => ensureTimeRange(t)),
                weekends: driver.availableTimings.weekends.map(t => ensureTimeRange(t))
            }
        }));
        res.status(200).json(formattedDrivers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching drivers', error: error.message });
    }
};


exports.getDriverDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const driver = await Driver.findOne({ driverId: id });
        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }

        const driverSchedules = await Schedule.find({ _id: { $in: driver.assignedSchedules } });
        const formattedDriver = {
            ...driver.toObject(),
            availableTimings: {
                weekdays: driver.availableTimings.weekdays.map(t => ensureTimeRange(t)),
                weekends: driver.availableTimings.weekends.map(t => ensureTimeRange(t))
            }
        };

        res.status(200).json({ driver: formattedDriver, schedules: driverSchedules });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching driver details', error: error.message });
    }
};


exports.createDriver = async (req, res) => {
    try {
        const newDriverData = req.body;
        if (newDriverData.availableTimings) {
            newDriverData.availableTimings.weekdays = newDriverData.availableTimings.weekdays.map(t => timeRangeToString(t));
            newDriverData.availableTimings.weekends = newDriverData.availableTimings.weekends.map(t => timeRangeToString(t));
        }

        const newDriver = new Driver(newDriverData);
        await newDriver.save();
        if (newDriver.assignedSchedules && newDriver.assignedSchedules.length > 0) {
            await Schedule.updateMany(
                { _id: { $in: newDriver.assignedSchedules } },
                {
                    $set: {
                        driver: {
                            id: newDriver.driverId,
                            name: newDriver.name,
                            license: newDriver.licenseNumber,
                            experience: `${newDriver.experienceYears} years`,
                            contact: newDriver.mobile,
                            rating: newDriver.rating
                        }
                    }
                }
            );
        }

        res.status(201).json(newDriver);
    } catch (error) {
        res.status(500).json({ message: 'Error creating driver', error: error.message });
    }
};

exports.updateDriver = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedDriverData = req.body;
        if (updatedDriverData.availableTimings) {
            updatedDriverData.availableTimings.weekdays = updatedDriverData.availableTimings.weekdays.map(t => timeRangeToString(t));
            updatedDriverData.availableTimings.weekends = updatedDriverData.availableTimings.weekends.map(t => timeRangeToString(t));
        }

        const oldDriver = await Driver.findOne({ driverId: id });
        if (!oldDriver) {
            return res.status(404).json({ message: 'Driver not found' });
        }

        const updatedDriver = await Driver.findOneAndUpdate(
            { driverId: id },
            updatedDriverData,
            { new: true } 
        );

        if (!updatedDriver) {
            return res.status(404).json({ message: 'Driver not found' });
        }

        const oldAssignedSchedules = oldDriver.assignedSchedules.map(s => s.toString()); // Convert ObjectIds to strings
        const newAssignedSchedules = updatedDriverData.assignedSchedules || [];

        const schedulesToUnassign = oldAssignedSchedules.filter(scheduleId =>
            !newAssignedSchedules.includes(scheduleId)
        );

        const schedulesToAssign = newAssignedSchedules.filter(scheduleId =>
            !oldAssignedSchedules.includes(scheduleId)
        );

        const schedulesToUpdate = newAssignedSchedules.filter(scheduleId =>
            oldAssignedSchedules.includes(scheduleId)
        );

        if (schedulesToUnassign.length > 0) {
            await Schedule.updateMany(
                { _id: { $in: schedulesToUnassign } },
                { $unset: { driver: 1 } } 
            );
        }

        if (schedulesToAssign.length > 0) {
            await Schedule.updateMany(
                { _id: { $in: schedulesToAssign } },
                {
                    $set: {
                        driver: {
                            id: updatedDriver.driverId,
                            name: updatedDriver.name,
                            license: updatedDriver.licenseNumber,
                            experience: `${updatedDriver.experienceYears} years`,
                            contact: updatedDriver.mobile,
                            rating: updatedDriver.rating
                        }
                    }
                }
            );
        }

        if (schedulesToUpdate.length > 0) {
            await Schedule.updateMany(
                { _id: { $in: schedulesToUpdate } },
                {
                    $set: {
                        'driver.id': updatedDriver.driverId,
                        'driver.name': updatedDriver.name,
                        'driver.license': updatedDriver.licenseNumber,
                        'driver.experience': `${updatedDriver.experienceYears} years`,
                        'driver.contact': updatedDriver.mobile,
                        'driver.rating': updatedDriver.rating
                    }
                }
            );
        }

        res.status(200).json(updatedDriver);
    } catch (error) {
        res.status(500).json({ message: 'Error updating driver', error: error.message });
    }
};


exports.deleteDriver = async (req, res) => {
    try {
        const { id } = req.params;

        const driverToDelete = await Driver.findOne({ driverId: id });
        if (!driverToDelete) {
            return res.status(404).json({ message: 'Driver not found' });
        }

        await Driver.deleteOne({ driverId: id });

        if (driverToDelete.assignedSchedules && driverToDelete.assignedSchedules.length > 0) {
            await Schedule.updateMany(
                { _id: { $in: driverToDelete.assignedSchedules } },
                { $unset: { driver: 1 } }
            );
        }

        res.status(200).json({ message: 'Driver deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting driver', error: error.message });
    }
};

exports.getAvailableSchedules = async (req, res) => {
    try {
        const availableSchedules = await Schedule.find({ 'driver': { $exists: false } });
        res.status(200).json(availableSchedules);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching available schedules', error: error.message });
    }
};


exports.getAllSchedules = async (req, res) => {
    try {
        const schedules = await Schedule.find();
        res.status(200).json(schedules);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching schedules', error: error.message });
    }
};



