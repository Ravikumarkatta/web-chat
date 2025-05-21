const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const { protect } = require('../middlewares/auth');

router.post('/', protect, roomController.createRoom);
router.get('/', protect, roomController.getAllRooms);
router.get('/:id', protect, roomController.getRoomById);
router.put('/:id', protect, roomController.updateRoom);
router.delete('/:id', protect, roomController.deleteRoom);

module.exports = router;
