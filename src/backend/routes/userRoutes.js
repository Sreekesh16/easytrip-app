const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');




router.route('/')
  .get(userController.getAllUsers);

// router.get('/', userController.getAllUsers);
router.route('/:id')
  .get( userController.getUserDetails);




module.exports = router;