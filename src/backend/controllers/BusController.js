const Bus = require('../models/BusModel'); // This imports your Mongoose Bus model
const mongoose = require('mongoose');

exports.getAllBuses = async (req, res) => {
    try {
        const buses = await Bus.find({}, { _id: 0 }).lean(); // .lean() is good for performance
        res.status(200).json({
            status: 'success',
            results: buses.length,
            data: { buses }
        });
    } catch (err) {
        console.error('Error fetching all buses:', err.message);
        res.status(500).json({ status: 'error', message: err.message });
    }
};

exports.getBus = async (req, res) => {
    try {
        const bus = await Bus.findOne({ id: req.params.id }).lean();
        if (!bus) {
            return res.status(404).json({ status: 'fail', message: 'Bus not found' });
        }
        res.status(200).json({ status: 'success', data: { bus } });
    } catch (err) {
        console.error('Error getting bus:', err.message);
        res.status(500).json({ status: 'error', message: err.message });
    }
};


exports.createBus = async (req, res) => {
    try {

      const documentToInsert = { ...req.body };

      const result = await Bus.collection.insertOne(documentToInsert);
      if (!result.acknowledged || !result.insertedId) {
          throw new Error('Document insertion not acknowledged or _id not returned.');
      }

      const newBus = await Bus.findById(result.insertedId).lean(); 
      if (!newBus) {
          throw new Error('Newly inserted bus not found after retrieval.');
      } 
      res.status(201).json({
        success: true,
        data: {
          bus: newBus 
        }
      });

    } catch (err) {
      console.error('--- ERROR CREATING BUS ---');
      console.error('Frontend sent:', JSON.stringify(req.body, null, 2));
      console.error('Mongoose Error Name:', err.name);
      console.error('Mongoose Error Code:', err.code);
      console.error('Mongoose Error Message:', err.message);
      if (err.code === 11000) {
        console.error('Duplicate Key Error:', err.keyValue);
        return res.status(409).json({
          success: false,
          message: `Duplicate field value: '${Object.keys(err.keyValue)[0]}' already exists. Please use another value.`,
          field: Object.keys(err.keyValue)[0]
        });
      }
      console.error('Unhandled Error Stack:', err.stack);
      res.status(500).json({
        success: false,
        message: 'Failed to create bus due to an unexpected server error.',
        detailedError: process.env.NODE_ENV !== 'production' ? err.message : undefined
      });
    }
  };

exports.updateBus = async (req, res) => {  
    try {    

        const busId = req.params.id;  
        const updateOperations = { $set: {} };

        const toNumber = (value) => {  
            if (value === undefined || value === null || value === '') {  
                return undefined; 
            }  
            const num = Number(value);
            return isNaN(num) ? undefined : num; 
        };  

        const topLevelFields = [  
            'registrationNumber',  
            'type',  
            'totalSeats',  
            'status',  
            'isActive'  
        ];  

        topLevelFields.forEach(field => {  
            if (req.body[field] !== undefined) {  
                if (field === 'totalSeats') {  
                    const numValue = toNumber(req.body[field]);
                    if (numValue !== undefined) { 
                        updateOperations.$set[field] = numValue;  
                    }
                } else {  
                    updateOperations.$set[field] = req.body[field];  
                }  
            }  
        });  

        if (req.body.lastServiceDate !== undefined) {  
            updateOperations.$set.lastServiceDate = req.body.lastServiceDate ? new Date(req.body.lastServiceDate) : null;  
        }  
        if (req.body.nextServiceDue !== undefined) {  
            updateOperations.$set.nextServiceDue = req.body.nextServiceDue ? new Date(req.body.nextServiceDue) : null;  
        }  

        if (req.body.berthStructure !== undefined) {
            if (req.body.berthStructure === null) {
                updateOperations.$set['berthStructure'] = null; 
            } else if (typeof req.body.berthStructure === 'object') {
                if (req.body.berthStructure.lower !== undefined) {  
                    const numValue = toNumber(req.body.berthStructure.lower);
                    if (numValue !== undefined) {
                        updateOperations.$set['berthStructure.lower'] = numValue;  
                    }
                }  
                if (req.body.berthStructure.upper !== undefined) {  
                    const numValue = toNumber(req.body.berthStructure.upper);
                    if (numValue !== undefined) {
                        updateOperations.$set['berthStructure.upper'] = numValue;  
                    } else if (req.body.berthStructure.upper === null || req.body.berthStructure.upper === '') {
                        updateOperations.$set['berthStructure.upper'] = null; 
                    }
                }  
                if (req.body.berthStructure.layout !== undefined) {  
                    updateOperations.$set['berthStructure.layout'] = req.body.berthStructure.layout;  
                }  
            }
        }  

        if (req.body.features !== undefined) {
            if (req.body.features === null) {
                updateOperations.$set['features'] = null; 
            } else if (typeof req.body.features === 'object') {
                ['hasWifi', 'hasToilet', 'isDoubleDecker', 'isPremium'].forEach(field => {  
                    if (req.body.features[field] !== undefined) {  
                        updateOperations.$set[`features.${field}`] = req.body.features[field];  
                    }  
                });  
            }
        }  
 
        if (Array.isArray(req.body.amenities)) {  
            updateOperations.$set.amenities = req.body.amenities;  
        } else if (req.body.amenities === null) {  
            updateOperations.$set.amenities = [];  
        }  


        if (Array.isArray(req.body.maintenanceHistory)) {  

            updateOperations.$set.maintenanceHistory = req.body.maintenanceHistory.map(item => {
                if (!item.date || !item.type) {
                    console.warn('Maintenance history item missing required date or type:', item);

                }
                return {  
                    date: item.date ? new Date(item.date) : undefined,
                    type: item.type,  
                    notes: item.notes !== undefined ? item.notes : undefined, 
                    mileage: toNumber(item.mileage), 
                    cost: toNumber(item.cost), 
                    technician: item.technician !== undefined ? item.technician : undefined 
                };  
            }).filter(item => item !== null); 
        } else if (req.body.maintenanceHistory === null) {  
            updateOperations.$set.maintenanceHistory = [];  
        }  

       
        if (Object.keys(updateOperations.$set).length === 0) {  
            delete updateOperations.$set;  
        }  
        
        if (Object.keys(updateOperations).length === 0) {
            const bus = await Bus.findOne({ id: busId }).lean();
            return res.status(200).json({
                status: 'success',
                message: 'No valid update fields provided or all provided fields are undefined.',
                data: { bus }
            });
        }

 
        const bus = await Bus.findOneAndUpdate(  
            { id: busId },
            updateOperations, 
            {  
                new: true,  
                runValidators: true, 
                lean: true 
            }  
        );  

        if (!bus) {  
            return res.status(404).json({  
                status: 'fail',  
                message: 'No bus found with that ID'  
            });  
        }  

        res.status(200).json({  
            status: 'success',  
            data: { bus }  
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

exports.deleteBus = async (req, res) => {
    try {
        const bus = await Bus.findOneAndDelete({ id: req.params.id });
        if (!bus) {
            return res.status(404).json({ status: 'fail', message: 'Bus not found' });
        }
        res.status(204).json({ status: 'success', data: null }); // 204 No Content for successful deletion
    } catch (err) {
        console.error('Error deleting bus:', err.message);
        res.status(500).json({ status: 'error', message: err.message });
    }
};