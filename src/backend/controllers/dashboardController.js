const Booking = require('../models/BookingModel');
const User = require('../models/User');
const Bus = require('../models/Bus');

exports.getDashboardData = async (req, res) => {
  try {
    // Test basic connection first
    const [bookingsCount, usersCount, busesCount] = await Promise.all([
      Booking.countDocuments(),
      User.countDocuments(),
      Bus.countDocuments()
    ]);
    const [allBookings, allUsers, allBuses] = await Promise.all([
      Booking.find().lean(),
      User.find().lean(),
      Bus.find().lean()
    ]);

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const totalRevenue = allBookings.reduce((sum, booking) => {
      if (booking.status?.current !== 'cancelled' && booking.fareDetails?.total) {
        return sum + booking.fareDetails.total;
      }
      return sum;
    }, 0);

    const monthlyBookings = allBookings.filter(booking => {
      const bookingDate = new Date(booking.bookingDetails?.date || 0);
      return bookingDate.getMonth() === currentMonth && 
             bookingDate.getFullYear() === currentYear;
    }).length;

    const cancelledTickets = allBookings.filter(booking => 
      booking.status?.current === 'cancelled'
    ).length;

    // const recentBookings = allBookings
    //   .sort((a, b) => new Date(b.bookingDetails?.date || 0) - new Date(a.bookingDetails?.date || 0))
    //   .slice(0, 5)
    //   .map(booking => ({
    //     id: booking.id,
    //     passengerName: booking.passengerDetails?.name || 'N/A',
    //     from: booking.schedule?.from?.city || 'N/A',
    //     to: booking.schedule?.to?.city || 'N/A',
    //     travelDate: booking.bookingDetails?.travelDate || 'N/A',
    //     bookingDate: booking.bookingDetails?.date || 'N/A',
    //     fare: booking.fareDetails?.total || 0,
    //     status: booking.status?.current || 'unknown',
    //     busType: booking.schedule?.bus?.type || 'N/A'
    //   }));
    const recentBookings = allBookings
  .sort((a, b) => new Date(b.bookingDetails?.date || 0) - new Date(a.bookingDetails?.date || 0))
  .slice(0, 5)
  .map(booking => {
    // Handle passenger names - works for both single passenger and multiple passengers
    let passengerNames = 'N/A';
    let passengerDetails = [];

    // Normalize passenger details to always be an array
    if (booking.passengerDetails) {
      passengerDetails = Array.isArray(booking.passengerDetails) 
        ? booking.passengerDetails 
        : [booking.passengerDetails];
    }

    // Process passenger names
    if (passengerDetails.length > 0) {
      passengerNames = passengerDetails
        .map(p => p?.name)
        .filter(name => name) // Remove undefined/null names
        .join(', ') || 'N/A';
    }

    return {
      id: booking.id,
      passengerName: passengerNames,
      from: booking.schedule?.from?.city || 'N/A',
      to: booking.schedule?.to?.city || 'N/A',
      travelDate: booking.bookingDetails?.travelDate || 'N/A',
      bookingDate: booking.bookingDetails?.date || 'N/A',
      fare: booking.fareDetails?.total || 0,
      status: booking.status?.current || 'unknown',
      busType: booking.schedule?.bus?.type || 'N/A',
      // Include additional fields if needed
      passengerCount: passengerDetails.length
    };
  });
    res.json({
      totalBuses: allBuses.length,
      totalRevenue,
      monthlyBookings,
      totalCustomers: allUsers.length,
      cancelledTickets,
      recentBookings
    });

  } catch (error) {
    console.error('\n!!! ERROR !!!');
    console.error('Full error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to load dashboard data',
      detailedError: process.env.NODE_ENV !== 'production' ? error.message : undefined
    });
  }
};