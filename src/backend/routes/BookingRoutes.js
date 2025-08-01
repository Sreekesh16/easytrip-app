const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/BookingController');




router.route('/')
  .get(bookingController.getAllBookings)
  .post(bookingController.createBooking);
router.route('/:id')
  .put(bookingController.updateBooking);


module.exports = router;