const User = require('../models/users');

// Get user profile (excluding password)
const getUserProfile = async (req, res) => {
    try {
        const user = req.user;
        const profile = await User.findById(user._id).select('-password'); // Exclude password

        if (!profile) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ profile });
        console.log('User profile retrieved successfully');
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
        console.log('Error retrieving user profile');
    }
};

// Update user profile
const updateUserProfile = async (req, res) => {
    const { username } = req.body;
    const user = req.user;

    try {
        const updatedProfile = await User.findByIdAndUpdate(
            user._id,
            { username },
            { new: true }
        ).select('-password'); // Exclude password

        if (!updatedProfile) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ updatedProfile });
        console.log('User profile updated successfully');
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
        console.log('Error updating user profile');
    }
};

module.exports = { getUserProfile, updateUserProfile };
