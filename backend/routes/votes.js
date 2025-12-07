const express = require('express');
const router = express.Router();
const { Vote, User, Election, Candidate, sequelize } = require('../models');
const { protect, admin } = require('../middleware/authMiddleware');
const { Op } = require('sequelize');

// @desc    Cast a vote
// @route   POST /api/votes
router.post('/', protect, async (req, res) => {
    const { electionId, candidateId } = req.body;
    try {
        // Check if voter is verified
        if (req.user.status !== 'Verified') {
            return res.status(403).json({ message: 'Your account is not verified. You cannot vote.' });
        }

        // Check if election is active
        const election = await Election.findByPk(electionId);
        const now = new Date();
        if (!election || now < election.startDate || now > election.endDate) {
            return res.status(400).json({ message: 'This election is not currently active.' });
        }

        const alreadyVoted = await Vote.findOne({
            where: {
                UserId: req.user.id,
                ElectionId: electionId
            }
        });

        if (alreadyVoted) {
            return res.status(400).json({ message: 'You have already voted in this election' });
        }
        const vote = await Vote.create({
            UserId: req.user.id,
            ElectionId: electionId,
            CandidateId: candidateId,
        });
        res.status(201).json({ message: 'Vote cast successfully' });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: 'You have already voted in this election' });
        }
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// @desc    Get votes cast by the logged-in user
// @route   GET /api/votes/myvotes
router.get('/myvotes', protect, async (req, res) => {
    try {
        const votes = await Vote.findAll({ where: { UserId: req.user.id } });
        res.json(votes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get election results
// @route   GET /api/votes/results/:electionId
router.get('/results/:electionId', protect, async (req, res) => {
    try {
        const electionId = req.params.electionId;

        const results = await Vote.findAll({
            where: { ElectionId: electionId },
            attributes: [
                'CandidateId',
                [sequelize.fn('COUNT', sequelize.col('CandidateId')), 'votes']
            ],
            include: [{
                model: Candidate,
                attributes: ['fullName']
            }],
            group: ['CandidateId', 'Candidate.id'],
            order: [[sequelize.literal('votes'), 'DESC']]
        });

        const formattedResults = results.map(r => ({
            candidateId: r.CandidateId,
            name: r.Candidate ? r.Candidate.fullName : 'Unknown',
            votes: parseInt(r.get('votes'))
        }));

        const totalVotes = formattedResults.reduce((acc, curr) => acc + curr.votes, 0);
        res.json({ results: formattedResults, totalVotes });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// @desc    Get list of voters for an election (admin only)
// @route   GET /api/votes/voters/:electionId
router.get('/voters/:electionId', protect, admin, async (req, res) => {
    try {
        const voters = await Vote.findAll({
            where: { ElectionId: req.params.electionId },
            include: [
                { model: User, attributes: ['username', 'email'] },
                { model: Candidate, attributes: ['fullName'] }
            ]
        });
        res.json(voters);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get stats for admin dashboard
// @route   GET /api/votes/stats/admin
router.get('/stats/admin', protect, admin, async (req, res) => {
    try {
        const totalElections = await Election.count();
        const totalCandidates = await Candidate.count();
        const totalVoters = await User.count({ where: { role: 'voter' } });
        const now = new Date();
        const activeElections = await Election.findAll({
            where: {
                startDate: { [Op.lte]: now },
                endDate: { [Op.gte]: now }
            }
        });

        const activeElectionsWithDetails = await Promise.all(activeElections.map(async (election) => {
            const totalVotes = await Vote.count({ where: { ElectionId: election.id } });
            const participation = totalVoters > 0 ? Math.round((totalVotes / totalVoters) * 100) : 0;
            return {
                ...election.get({ plain: true }),
                voterParticipation: participation,
            };
        }));

        res.json({
            stats: {
                totalElections,
                totalCandidates,
                totalVoters,
                activeElectionsCount: activeElections.length
            },
            activeElections: activeElectionsWithDetails,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});


// @desc    Get stats for voter dashboard
// @route   GET /api/votes/stats/voter
router.get('/stats/voter', protect, async (req, res) => {
    try {
        const now = new Date();
        const activeElections = await Election.findAll({
            where: {
                startDate: { [Op.lte]: now },
                endDate: { [Op.gte]: now }
            }
        });
        const activeElectionIds = activeElections.map(e => e.id);
        const totalVoters = await User.count({ where: { role: 'voter' } });
        const registeredCandidates = await Candidate.count({
            where: { ElectionId: { [Op.in]: activeElectionIds } }
        });

        const activeElectionsWithDetails = await Promise.all(activeElections.map(async (election) => {
            const candidateCount = await Candidate.count({ where: { ElectionId: election.id } });
            const totalVotes = await Vote.count({ where: { ElectionId: election.id } });
            const participation = totalVoters > 0 ? Math.round((totalVotes / totalVoters) * 100) : 0;
            return {
                ...election.get({ plain: true }),
                candidateCount,
                voterParticipation: participation,
            };
        }));

        res.json({
            stats: {
                activeElections: activeElections.length,
                registeredCandidates: registeredCandidates
            },
            activeElections: activeElectionsWithDetails
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});


module.exports = router;
