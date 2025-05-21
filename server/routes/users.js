const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middlewares/auth');
const { validateUserUpdate } = require('../middlewares/validation');

// User management routes
router.get('/', protect, userController.getAllUsers);
router.get('/:id', protect, userController.getUserById);
router.put('/:id', protect, validateUserUpdate, userController.updateUser);
router.delete('/:id', protect, userController.deleteUser);

module.exports = router;
