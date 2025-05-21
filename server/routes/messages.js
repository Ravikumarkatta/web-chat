const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { protect } = require('../middlewares/auth');

router.post('/', protect, messageController.createMessage);
router.get('/:roomId', protect, messageController.getMessagesByRoom);
router.get('/:id', protect, messageController.getMessageById);
router.delete('/:id', protect, messageController.deleteMessage);

module.exports = router;
