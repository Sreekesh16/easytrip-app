const Driver = require('../models/DriverModel');
const ScheduleModel=require('../models/ScheduleModel');

exports.getAllDrivers = async (req, res) => {
    try {
      // 1. First get all drivers (lean for better performance)
      const drivers = await Driver.find().lean();
      
      // 2. Get all driverIds to fetch their schedules
      const driverIds = drivers.map(driver => driver.driverId);
      
      // 3. Get all schedules for these drivers
      const schedules = await ScheduleModel.find({ 
        'driver.driverId': { $in: driverIds } 
      }).lean();

      // 4. Create a map of schedules by driverId for quick lookup
      const schedulesByDriverId = schedules.reduce((map, schedule) => {
        const driverId = schedule.driver.driverId;
        if (!map[driverId]) {
          map[driverId] = [];
        }
        map[driverId].push(schedule);
        return map;
      }, {});

      // 5. Create the response by adding schedules to each driver
      const driversWithSchedules = drivers.map(driver => {
        return {
          ...driver,  // Original driver data remains unchanged
          schedules: schedulesByDriverId[driver.driverId] || []  // Add schedules array
        };
      });

      res.status(200).json(driversWithSchedules);

    } catch (err) {
      res.status(500).json({ 
        message: 'Error fetching drivers with schedule details', 
        error: err.message 
      });
    }
};


exports.getDriver = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id).populate('assignedSchedules');

    if (!driver) {
      return res.status(404).json({
        status: 'fail',
        message: 'Driver not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        driver
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

exports.createDriver = async (req, res) => {
  try {
    const newDriver = await Driver.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        driver: newDriver
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.updateDriver = async (req, res) => {
  try {
    const driver = await Driver.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!driver) {
      return res.status(404).json({
        status: 'fail',
        message: 'Driver not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        driver
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.deleteDriver = async (req, res) => {
  try {
    const driver = await Driver.findOneAndDelete({driverId:req.params.id});
    if (!driver) {
      return res.status(404).json({
        status: 'fail',
        message: 'Driver not found'
      });
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};