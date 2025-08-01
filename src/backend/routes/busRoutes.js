const express = require('express');
const router = express.Router();
const busController = require('../controllers/BusController');

router.route('/')
  .get(busController.getAllBuses)
  .post(busController.createBus);

router.route('/:id')
  .get(busController.getBus)
  .put(busController.updateBus)
  .delete(busController.deleteBus);

module.exports = router;