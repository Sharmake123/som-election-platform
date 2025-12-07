const express = require('express');
const router = express.Router();
const { Message } = require('../models');
const { protect, admin } = require('../middleware/authMiddleware');

// @desc    Create a new message (Public)
// @route   POST /api/messages
router.post('/', async (req, res) => {
    const { name, email, subject, message } = req.body;

    try {
        const newMessage = await Message.create({
            name,
            email,
            subject,
            message
        });

        res.status(201).json(newMessage);
    } catch (error) {
        console.error('CREATE MESSAGE ERROR:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get all messages (Admin only)
// @route   GET /api/messages
router.get('/', protect, admin, async (req, res) => {
    try {
        const messages = await Message.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.json(messages);
    } catch (error) {
        console.error('GET MESSAGES ERROR:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
