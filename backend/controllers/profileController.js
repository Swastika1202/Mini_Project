const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const cloudinary = require('../config/cloudinary'); // Import cloudinary config

// @desc    Get user profile
// @route   GET /api/profile
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (user) {
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.email = req.body.email || user.email;
    user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
    user.country = req.body.country || user.country;
    user.cityState = req.body.cityState || user.cityState;
    user.linkedinUrl = req.body.linkedinUrl || user.linkedinUrl;
    user.profession = req.body.profession || user.profession;
    user.location = req.body.location || user.location;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      phoneNumber: updatedUser.phoneNumber,
      country: updatedUser.country,
      cityState: updatedUser.cityState,
      linkedinUrl: updatedUser.linkedinUrl,
      profession: updatedUser.profession,
      location: updatedUser.location,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Upload user avatar
// @route   PUT /api/profile/avatar
// @access  Private
const uploadAvatar = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (user) {
    if (req.file) {
      const base64Image = req.file.buffer.toString('base64');
      const dataUri = `data:${req.file.mimetype};base64,${base64Image}`;
      const result = await cloudinary.uploader.upload(dataUri, {
        folder: 'avatars',
        format: 'png',
      });
      user.avatar = result.secure_url;
    } else {
      res.status(400);
      throw new Error('No avatar file provided');
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      avatarUrl: updatedUser.avatar,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

module.exports = { getProfile, updateProfile, uploadAvatar };

