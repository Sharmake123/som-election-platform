
const express = require('express');
const router = express.Router();
const { Election } = require('../models');
const { protect, admin } = require('../middleware/authMiddleware');

// @desc    Get all elections
// @route   GET /api/elections
router.get('/', protect, async (req, res) => {
    try {
        const elections = await Election.findAll();
        // Dynamically determine status
        const electionsWithStatus = elections.map(e => {
            const electionData = e.get({ plain: true });
            const now = new Date();
            const startDate = new Date(electionData.startDate);
            const endDate = new Date(electionData.endDate);
            let status = 'Upcoming';
            if (now >= startDate && now <= endDate) {
                status = 'Active';
            } else if (now > endDate) {
                status = 'Completed';
            }
            // Return a plain object to add the status property
            return { ...electionData, status };
        });
        res.json(electionsWithStatus);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Create an election
// @route   POST /api/elections
router.post('/', protect, admin, async (req, res) => {
    const { name, position, startDate, endDate } = req.body;
    try {
        const election = await Election.create({ name, position, startDate, endDate });
        res.status(201).json(election);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Invalid data' });
    }
});

// @desc    Update an election
// @route   PUT /api/elections/:id
router.put('/:id', protect, admin, async (req, res) => {
    const { name, position, startDate, endDate } = req.body;
    try {
        const election = await Election.findByPk(req.params.id);
        if (election) {
            election.name = name || election.name;
            election.position = position || election.position;
            election.startDate = startDate || election.startDate;
            election.endDate = endDate || election.endDate;
            const updatedElection = await election.save();
            res.json(updatedElection);
        } else {
            res.status(404).json({ message: 'Election not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Invalid data' });
    }
});


// @desc    Delete an election
// @route   DELETE /api/elections/:id
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const election = await Election.findByPk(req.params.id);
        if (election) {
            await election.destroy();
            res.json({ message: 'Election removed' });
        } else {
            res.status(404).json({ message: 'Election not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
