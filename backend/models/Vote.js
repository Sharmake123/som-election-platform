const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Vote = sequelize.define('Vote', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
}, {
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['UserId', 'ElectionId'],
    },
  ],
});

module.exports = Vote;
