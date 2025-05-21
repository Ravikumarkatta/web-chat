const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  text: {
    type: String,
    required: [true, 'Message text is required'],
    trim: true,
    maxlength: [2000, 'Message cannot be more than 2000 characters']
  },
  attachments: [{
    type: String,
    default: []
  }],
  readBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Auto-populate sender details
MessageSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'sender',
    select: 'name initials color'
  });
  next();
});

// Format message for client
MessageSchema.methods.formatForClient = function() {
  return {
    _id: this._id,
    sender: {
      _id: this.sender._id,
      name: this.sender.name,
      initials: this.sender.initials,
      color: this.sender.color
    },
    room: this.room,
    text: this.text,
    attachments: this.attachments,
    readBy: this.readBy,
    time: new Date(this.createdAt).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    createdAt: this.createdAt
  };
};

module.exports = mongoose.model('Message', MessageSchema);