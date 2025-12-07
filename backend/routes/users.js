const express = require('express');
const router = express.Router();
const { User } = require('../models');
const { protect, admin } = require('../middleware/authMiddleware');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] }
        });
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Create a new user
// @route   POST /api/users
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
    const { username, email, password, mobile, nationalId, dob, role, status } = req.body;
    try {
        const userExists = await User.findOne({ where: { email } });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            username,
            email,
            password, // Hook will hash this
            mobile,
            nationalId,
            dob,
            role: role || 'voter',
            status: status || 'Verified',
            photo: 'no-photo.jpg'
        });

        res.status(201).json({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            status: user.status
        });
    } catch (error) {
        console.error(error);
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: error.errors.map(e => e.message).join(', ') });
        }
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Update a user
// @route   PUT /api/users/:id
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (user) {
            user.username = req.body.username || user.username;
            user.email = req.body.email || user.email;
            user.mobile = req.body.mobile || user.mobile;
            user.nationalId = req.body.nationalId || user.nationalId;
            user.dob = req.body.dob || user.dob;
            user.role = req.body.role || user.role;
            user.status = req.body.status || user.status;

            if (req.body.password) {
                user.password = req.body.password; // Hook will hash this
            }

            const updatedUser = await user.save();

            res.json({
                id: updatedUser.id,
                username: updatedUser.username,
                email: updatedUser.email,
                role: updatedUser.role,
                status: updatedUser.status
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: error.errors.map(e => e.message).join(', ') });
        }
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Verify a user (Legacy support, can use PUT /:id now)
// @route   PUT /api/users/:id/verify
// @access  Private/Admin
router.put('/:id/verify', protect, admin, async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (user) {
            user.status = 'Verified';
            await user.save();
            res.json({ message: 'User has been verified' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (user) {
            await user.destroy();
            res.json({ message: 'User removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});


module.exports = router;
