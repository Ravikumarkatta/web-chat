const User = require('../models/User');
const asyncHandler = require('express-async-handler');

/**
 * @desc    Register new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Create new user
  const user = await User.create({
    name,
    email,
    password
  });

  if (user) {
    // Generate JWT token
    const token = user.getSignedJwtToken();
    
    res.status(201).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        initials: user.initials,
        color: user.color
      },
      token
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for user
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  // Update user's active status
  user.active = true;
  user.lastSeen = Date.now();
  await user.save();

  // Generate JWT token
  const token = user.getSignedJwtToken();
  
  res.status(200).json({
    success: true,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      initials: user.initials,
      color: user.color,
      active: user.active
    },
    token
  });
});

/**
 * @desc    Get user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      initials: user.initials,
      color: user.color,
      active: user.active,
      lastSeen: user.lastSeen
    }
  });
});

/**
 * @desc    Logout user (update status)
 * @route   POST /api/auth/logout
 * @access  Private
 */
const logout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, {
    active: false,
    lastSeen: Date.now()
  });

  res.status(200).json({
    success: true,
    message: 'User logged out'
  });
});

module.exports = {
  register,
  login,
  getMe,
  logout
};