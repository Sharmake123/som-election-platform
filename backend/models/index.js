const sequelize = require('../config/database');
const User = require('./User');
const Election = require('./Election');
const Candidate = require('./Candidate');
const Vote = require('./Vote');
const Message = require('./Message');

// Associations
Election.hasMany(Candidate);
Candidate.belongsTo(Election);

User.hasMany(Vote);
Vote.belongsTo(User);

Election.hasMany(Vote);
Vote.belongsTo(Election);

Candidate.hasMany(Vote);
Vote.belongsTo(Candidate);

module.exports = {
    sequelize,
    User,
    Election,
    Candidate,
    Vote,
    Message,
};
