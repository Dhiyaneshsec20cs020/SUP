const Sequelize = require('sequelize');
const sequelize = require('../config/db'); // Make sure this is the correct path to your DB config

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.User = require('./User')(sequelize, Sequelize);
db.Connection = require('./Connection')(sequelize, Sequelize);
db.Message = require('./Message')(sequelize, Sequelize);

// Define associations

db.User.hasMany(db.Connection, { foreignKey: 'senderId', as: 'SentRequests' });
db.User.hasMany(db.Connection, { foreignKey: 'receiverId', as: 'ReceivedRequests' });

db.Connection.belongsTo(db.User, { foreignKey: 'senderId', as: 'Sender' });
db.Connection.belongsTo(db.User, { foreignKey: 'receiverId', as: 'Receiver' });

module.exports = db;
