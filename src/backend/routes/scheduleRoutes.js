const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/ScheduleController');

router.route('/')
  .get(scheduleController.getAllSchedules)
  .post(scheduleController.createSchedule);

router.route('/:id')
  .get(scheduleController.getSchedule)
  .put(scheduleController.updateSchedule)
  .delete(scheduleController.deleteSchedule);

module.exports = router;