  const Booking = require('../models/BookingModel'); 
  exports.getAllBookings = async (req, res) => {
      try {
          const bookings = await Booking.find({}, { __v: 0 }).lean();
          const transformed = bookings.map(booking => ({
              ...booking,
          }));
          res.status(200).json(transformed);
      } catch (error) {
          res.status(500).json({ message: 'Error fetching bookings', error: error.message });
      }
  };
  const Schedule = require('../models/ScheduleModel');
  const User = require('../models/UserModel');

  exports.createBooking = async (req, res) => {
    try {
      const bookingData = req.body;
      const savedBooking = await Booking.create(bookingData);

      res.status(201).json({
        message: 'Booking created successfully',
        booking: savedBooking
      });

    } catch (error) {
      console.error('Error creating booking:', error);
      res.status(500).json({
        message: 'Failed to create booking',
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  };

exports.updateBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Validate the booking exists
        const existingBooking = await Booking.findOne({ id: id });
        if (!existingBooking) {
            return res.status(404).json({ 
                success: false,
                message: `Booking with id ${id} not found`
            });
        }

        // Perform the update - only the fields that were sent
        const updatedBooking = await Booking.findOneAndUpdate(
            { id: id },
            { $set: updateData },
            { 
                new: true,
                runValidators: true,
                lean: true 
            }
        );

        res.status(200).json({
            success: true,
            message: 'Booking updated successfully',
            data: updatedBooking
        });

    } catch (error) {
        console.error('Update error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update booking',
            error: error.message
        });
    }
};

function calculateRefund(totalFare, travelDate) {
    const daysUntilTravel = Math.floor((new Date(travelDate) - new Date()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilTravel > 7) return totalFare * 0.9; // 90% refund
    if (daysUntilTravel > 3) return totalFare * 0.5; // 50% refund
    if (daysUntilTravel > 1) return totalFare * 0.2; // 20% refund
    return 0; // No refund
}