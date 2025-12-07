const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Candidate = sequelize.define('Candidate', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  photo: {
    type: DataTypes.STRING,
    defaultValue: 'no-photo.jpg',
  },
  bio: {
    type: DataTypes.TEXT,
  },
}, {
  timestamps: true,
});

module.exports = Candidate;
