
const mongoose = require('mongoose');
const User = require('../model/User');

// Add new user profile
const addProfile = async (req, res) => {
  try {
    const { _id } = req.user; // Use _id from user object
    const { firstName, lastName, bio, phonenumber, email, address, gender } = req.body;
    const profileImage = req.file ? req.file.filename : null;

    // Validate input
    if (!_id) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Check if user already exists
    const existingUser = await User.findById(_id);
    if (existingUser) {
      return res.status(400).json({ error: 'User profile already exists' });
    }

    // Prepare profile data
    const profileData = {
      _id,
      firstName,
      lastName,
      bio,
      phonenumber,
      email,
      address,
      gender,
      ...(profileImage && { profileImage }),
    };

    // Create new user profile
    const user = await User.create(profileData);

    res.status(201).json({ message: 'Profile created successfully', user });
  } catch (error) {
    console.error('Error in addProfile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update existing user profile
const updateProfile = async (req, res) => {
  try {
    const { _id } = req.user; // Use _id from user object
    const { firstName, lastName, bio, phonenumber, email, address, gender } = req.body;
    const profileImage = req.file ? req.file.filename : null;

    // Validate input
    if (!_id) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Prepare update object
    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (bio) updateData.bio = bio;
    if (phonenumber) updateData.phonenumber = phonenumber;
    if (email) updateData.email = email;
    if (address) updateData.address = address;
    if (gender) updateData.gender = gender;
    if (profileImage) updateData.profileImage = profileImage;

    // Update user profile
    const user = await User.findByIdAndUpdate(
      _id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Error in updateProfile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get user profile
const getProfile = async (req, res) => {
  try {
    const { _id } = req.user; // Use _id from user object
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error('Error in getProfile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get profile image by filename
const getProfileImage = async (req, res) => {
  try {
    const { filename } = req.params;
    if (!filename) {
      return res.status(400).json({ error: 'Filename is required' });
    }
    const user = await User.findOne({ profileImage: filename });
    if (!user) {
      return res.status(404).json({ error: 'User or profile image not found' });
    }
    res.status(200).json({ profileImage: user.profileImage });
  } catch (error) {
    console.error('Error in getProfileImage:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { addProfile, updateProfile, getProfile, getProfileImage };