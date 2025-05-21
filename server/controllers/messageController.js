const Message = require('../models/Message');
const User = require('../models/User');
const Room = require('../models/Room');

// Message controller functions
const createMessage = async (req, res) => {
  try {
    const { content, roomId } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    const message = new Message({
      content,
      user: user._id,
      room: room._id
    });

    await message.save();
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getMessagesByRoom = async (req, res) => {
  try {
    const messages = await Message.find({ room: req.params.roomId })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getMessageById = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id)
      .populate('user', 'name email')
      .populate('room', 'name');
    
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    res.json(message);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    res.json({ message: 'Message deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  createMessage,
  getMessagesByRoom,
  getMessageById,
  deleteMessage
};
