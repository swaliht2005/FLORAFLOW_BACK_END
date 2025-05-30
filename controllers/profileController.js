
const mongoose = require('mongoose');
const User = require('../model/User');
const path = require('path');
const fs = require('fs');

const addProfile = async (req, res) => {
    try {
        const userId = req.user.id; // Use req.user.id
        const { firstName, lastName, bio, phonenumber, email, address, gender } = req.body;
        const profileImage = req.file ? req.file.filename : null;

        if (!userId) {
            console.error('addProfile: User ID missing');
            return res.status(400).json({ error: 'User ID is required' });
        }

        const profileData = {
            firstName,
            lastName,
            bio,
            phonenumber,
            email,
            address,
            gender,
            ...(profileImage && { profileImage }),
        };

        const user = await User.findByIdAndUpdate(
            userId,
            { $set: profileData },
            { new: true, upsert: true, runValidators: true }
        );

        console.log(`addProfile: Profile created/updated for userId: ${userId}`);
        res.status(201).json({ message: 'Profile created/updated successfully', user });
    } catch (error) {
        console.error('Error in addProfile:', { message: error.message, stack: error.stack });
        res.status(500).json({ error: 'Internal server error' });
    }
};

const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id; // Use req.user.id
        const { firstName, lastName, bio, phonenumber, email, address, gender } = req.body;
        const profileImage = req.file ? req.file.filename : null;

        if (!userId) {
            console.error('updateProfile: User ID missing');
            return res.status(400).json({ error: 'User ID is required' });
        }

        const updateData = {};
        if (firstName) updateData.firstName = firstName;
        if (lastName) updateData.lastName = lastName;
        if (bio) updateData.bio = bio;
        if (phonenumber) updateData.phonenumber = phonenumber;
        if (email) updateData.email = email;
        if (address) updateData.address = address;
        if (gender) updateData.gender = gender;
        if (profileImage) updateData.profileImage = profileImage;

        const user = await User.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!user) {
            console.error(`updateProfile: User not found for userId: ${userId}`);
            return res.status(404).json({ error: 'User not found' });
        }

        console.log(`updateProfile: Profile updated for userId: ${userId}`);
        res.status(200).json({ message: 'Profile updated successfully', user });
    } catch (error) {
        console.error('Error in updateProfile:', { message: error.message, stack: error.stack });
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getProfile = async (req, res) => {
    try {
        const userId = req.user.id; // Use req.user.id
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            console.error(`getProfile: Invalid user ID format: ${userId}`);
            return res.status(400).json({ error: 'Invalid user ID' });
        }

        const user = await User.findById(userId);
        if (!user) {
            console.error(`getProfile: User not found for userId: ${userId}`);
            return res.status(404).json({ error: 'User not found' });
        }

        console.log(`getProfile: Profile retrieved for userId: ${userId}`);
        res.status(200).json({ user });
    } catch (error) {
        console.error('Error in getProfile:', { message: error.message, stack: error.stack });
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getProfileImage = async (req, res) => {
    try {
        const userId = req.user.id; // Use req.user.id
        const user = await User.findById(userId);
        if (!user || !user.profileImage) {
            console.error(`getProfileImage: Profile image not found for userId: ${userId}`);
            return res.status(404).json({ error: 'Profile image not found' });
        }

        const imagePath = path.join(__dirname, '..', 'Uploads', user.profileImage);
        if (!fs.existsSync(imagePath)) {
            console.error(`getProfileImage: Image file not found at: ${imagePath}`);
            return res.status(404).json({ error: 'Image file not found' });
        }

        res.sendFile(imagePath);
    } catch (error) {
        console.error('Error in getProfileImage:', { message: error.message, stack: error.stack });
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { addProfile, updateProfile, getProfile, getProfileImage };