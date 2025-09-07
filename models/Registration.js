const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');
const Event = require('./Event');

const Registration = sequelize.define('Registration', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  eventId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'events',
      key: 'id'
    }
  },
  paymentStatus: {
    type: DataTypes.ENUM('pending', 'completed', 'failed'),
    defaultValue: 'pending'
  },
  paymentAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  paymentDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'registrations',
  indexes: [
    {
      unique: true,
      fields: ['userId', 'eventId']
    }
  ]
});

// Define associations
Registration.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Registration.belongsTo(Event, { foreignKey: 'eventId', as: 'event' });
User.hasMany(Registration, { foreignKey: 'userId', as: 'registrations' });
Event.hasMany(Registration, { foreignKey: 'eventId', as: 'registrations' });

module.exports = Registration;