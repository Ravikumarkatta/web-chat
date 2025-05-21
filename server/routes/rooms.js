const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const { protect } = require('../middlewares/auth');
const { validateRoomCreate, validateRoomUpdate } = require('../middlewares/validation');

// Room management routes
router.post('/', protect, validateRoomCreate, roomController.createRoom);
router.get('/', protect, roomController.getAllRooms);
router.get('/:id', protect, roomController.getRoomById);
router.put('/:id', protect, validateRoomUpdate, roomController.updateRoom);
router.delete('/:id', protect, roomController.deleteRoom);
router.post('/:id/join', protect, roomController.joinRoom);
router.post('/:id/leave', protect, roomController.leaveRoom);

module.exports = router;
