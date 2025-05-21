const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a room name'],
    trim: true,
    maxlength: [50, 'Room name cannot be more than 50 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [200, 'Description cannot be more than 200 characters']
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isPrivate: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for message count
RoomSchema.virtual('messageCount', {
  ref: 'Message',
  localField: '_id',
  foreignField: 'room',
  count: true
});

// Virtual for active members count
RoomSchema.virtual('activeMembers', {
  ref: 'User',
  localField: 'members',
  foreignField: '_id',
  match: { active: true },
  count: true
});

// Middleware to populate creator and members
RoomSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'creator',
    select: 'name initials color'
  });
  next();
});

module.exports = mongoose.model('Room', RoomSchema);