const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { Candidate, Election } = require('../models');
const { protect, admin } = require('../middleware/authMiddleware');
const { Op } = require('sequelize');

// Multer storage configuration
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    },
});

function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Images only!');
    }
}

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});

// @desc    Get all candidates
// @route   GET /api/candidates
router.get('/', protect, admin, async (req, res) => {
    try {
        const candidates = await Candidate.findAll({
            include: [{ model: Election, attributes: ['name'] }]
        });
        res.json(candidates);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get candidates for public homepage showcase
// @route   GET /api/candidates/showcase
router.get('/showcase', async (req, res) => {
    try {
        const candidates = await Candidate.findAll({
            limit: 3,
            order: [['createdAt', 'DESC']]
        });
        res.json(candidates);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get single candidate details (Public)
// @route   GET /api/candidates/:id
router.get('/:id', async (req, res) => {
    try {
        const candidate = await Candidate.findByPk(req.params.id, {
            include: [{ model: Election, attributes: ['name'] }]
        });

        if (!candidate) {
            return res.status(404).json({ message: 'Candidate not found' });
        }

        res.json(candidate);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get candidates for a specific election
// @route   GET /api/candidates/election/:electionId
router.get('/election/:electionId', protect, async (req, res) => {
    try {
        const candidates = await Candidate.findAll({
            where: { ElectionId: req.params.electionId }
        });
        res.json(candidates);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Add a candidate
// @route   POST /api/candidates
router.post('/', protect, admin, upload.single('photo'), async (req, res) => {
    const { fullName, email, election, bio } = req.body;
    try {
        // Add validation for required fields
        if (!fullName || !email || !election) {
            return res.status(400).json({ message: 'Please provide full name, email, and election' });
        }

        const candidateExists = await Candidate.findOne({ where: { email } });
        if (candidateExists) {
            return res.status(400).json({ message: 'Candidate with this email already exists' });
        }

        const candidate = await Candidate.create({
            fullName,
            email,
            ElectionId: election,
            bio,
            photo: req.file ? req.file.filename : 'no-photo.jpg'
        });

        res.status(201).json(candidate);
    } catch (error) {
        console.error('CANDIDATE CREATION ERROR:', error); // For server-side debugging
        if (error.name === 'SequelizeValidationError') {
            const messages = error.errors.map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        // Generic fallback
        res.status(500).json({ message: 'Server error while creating candidate.', error: error.message });
    }
});

// @desc    Update a candidate
// @route   PUT /api/candidates/:id
router.put('/:id', protect, admin, upload.single('photo'), async (req, res) => {
    const { fullName, email, election, bio } = req.body;
    try {
        const candidate = await Candidate.findByPk(req.params.id);
        if (candidate) {
            // Check if the new email is already taken by another candidate
            if (email) {
                const existingCandidate = await Candidate.findOne({
                    where: {
                        email: email,
                        id: { [Op.ne]: req.params.id }
                    }
                });
                if (existingCandidate) {
                    return res.status(400).json({ message: 'A candidate with this email already exists' });
                }
            }

            // Only update fields that were actually sent
            if (fullName) candidate.fullName = fullName;
            if (email) candidate.email = email;
            if (election) candidate.ElectionId = election;
            if (bio) candidate.bio = bio;

            if (req.file) {
                // If there's an old photo and it's not the default, delete it
                if (candidate.photo && candidate.photo !== 'no-photo.jpg') {
                    const oldImagePath = path.join(__dirname, '..', 'uploads', candidate.photo);
                    if (fs.existsSync(oldImagePath)) {
                        fs.unlink(oldImagePath, (err) => {
                            if (err) console.error(`Error deleting old photo: ${err}`);
                        });
                    }
                }
                candidate.photo = req.file.filename;
            }
            const updatedCandidate = await candidate.save();
            res.json(updatedCandidate);
        } else {
            res.status(404).json({ message: 'Candidate not found' });
        }
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ message: 'Invalid data provided', errors: error.errors });
        }
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});


// @desc    Delete a candidate
// @route   DELETE /api/candidates/:id
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const candidate = await Candidate.findByPk(req.params.id);
        if (candidate) {
            // Delete the photo file from the server
            if (candidate.photo && candidate.photo !== 'no-photo.jpg') {
                const imagePath = path.join(__dirname, '..', 'uploads', candidate.photo);
                fs.unlink(imagePath, (err) => {
                    if (err) console.error(`Error deleting photo: ${err}`);
                });
            }
            await candidate.destroy();
            res.json({ message: 'Candidate removed' });
        } else {
            res.status(404).json({ message: 'Candidate not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});


module.exports = router;
