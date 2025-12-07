const express = require('express');
const router = express.Router();
const { User } = require('../models');
const jwt = require('jsonwebtoken');
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Op } = require('sequelize');

// Multer storage configuration for user photos
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        // Use user ID for a more unique filename
        cb(null, `user-${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
    },
});

function checkFileType(req, file, cb) {
    // If no file is submitted, just continue
    if (!file.originalname) {
        return cb(null, true);
    }

    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Images only!'));
    }
}

const upload = multer({ storage, fileFilter: checkFileType });

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register a new user
// @route   POST /api/auth/register
router.post('/register', async (req, res) => {
    const { username, email, password, mobile, nationalId, dob } = req.body;
    try {
        const userExists = await User.findOne({
            where: {
                [Op.or]: [{ email }, { username }, { nationalId }]
            }
        });

        if (userExists) {
            return res.status(400).json({ message: 'User with given details already exists' });
        }
        const user = await User.create({ username, email, password, mobile, nationalId, dob });
        res.status(201).json({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            photo: user.photo,
            token: generateToken(user.id),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        // Check for user by username OR email
        const user = await User.findOne({
            where: {
                [Op.or]: [
                    { username: username },
                    { email: username }
                ]
            }
        });

        if (user && (await user.matchPassword(password))) {
            res.json({
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                photo: user.photo,
                token: generateToken(user.id),
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get user profile
// @route   GET /api/auth/profile
router.get('/profile', protect, async (req, res) => {
    const user = await User.findByPk(req.user.id);
    if (user) {
        res.json({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            photo: user.photo,
            mobile: user.mobile,
            nationalId: user.nationalId,
            dob: user.dob,
            status: user.status,
            createdAt: user.createdAt,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
router.put('/profile', protect, upload.single('photo'), async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);

        if (user) {
            // Prevent non-admins from changing their role or status
            if (req.body.role || req.body.status) {
                return res.status(403).json({ message: 'You are not authorized to change role or status.' });
            }

            user.username = req.body.username || user.username;
            user.email = req.body.email || user.email;
            user.mobile = req.body.mobile || user.mobile;

            if (req.file) {
                // If there's an old photo and it's not the default, delete it
                if (user.photo && user.photo !== 'no-photo.jpg') {
                    const oldImagePath = path.join(__dirname, '..', 'uploads', user.photo);
                    if (fs.existsSync(oldImagePath)) {
                        fs.unlinkSync(oldImagePath);
                    }
                }
                user.photo = req.file.filename;
            }

            const updatedUser = await user.save();

            res.json({
                id: updatedUser.id,
                username: updatedUser.username,
                email: updatedUser.email,
                role: updatedUser.role,
                photo: updatedUser.photo,
                mobile: updatedUser.mobile,
                nationalId: updatedUser.nationalId,
                dob: updatedUser.dob,
                status: updatedUser.status,
                createdAt: updatedUser.createdAt,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('PROFILE UPDATE ERROR:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// @desc    Update user password
// @route   PUT /api/auth/updatepassword
router.put('/updatepassword', protect, async (req, res) => {
    const user = await User.findByPk(req.user.id);

    if (user && (await user.matchPassword(req.body.currentPassword))) {
        user.password = req.body.newPassword;
        await user.save();
        res.json({ message: 'Password updated successfully' });
    } else {
        res.status(401).json({ message: 'Invalid current password' });
    }
});

// @desc    Reset password (Self-Service)
// @route   POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
    const { nationalId, mobile, newPassword } = req.body;

    try {
        // Find user by National ID and Mobile
        const user = await User.findOne({
            where: {
                nationalId,
                mobile
            }
        });

        if (!user) {
            return res.status(404).json({ message: 'No user found with these details. Please check your National ID and Mobile Number.' });
        }

        // Update password (hook will hash it)
        user.password = newPassword;
        await user.save();

        res.json({ message: 'Password has been reset successfully. You can now login.' });

    } catch (error) {
        console.error('PASSWORD RESET ERROR:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});


module.exports = router;
