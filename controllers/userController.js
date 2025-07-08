const db = require('../models');
const { Op, Sequelize } = require('sequelize');

exports.getNearbyUsers = async (req, res) => {
  try {
    const currentUser = await db.User.findByPk(req.userId);

    if (!currentUser || !currentUser.latitude || !currentUser.longitude) {
      return res.status(400).json({ error: 'User location not found' });
    }

    const radiusInKm = 5;
    const { latitude, longitude } = currentUser;

    // Step 1: Get connected user IDs
    const connections = await db.Connection.findAll({
      where: {
        [Sequelize.Op.or]: [
          { senderId: req.userId, status: 'accepted' },
          { receiverId: req.userId, status: 'accepted' }
        ]
      }
    });

    const connectedUserIds = connections.map(conn =>
      conn.senderId === req.userId ? conn.receiverId : conn.senderId
    );

    // Step 2: Run filtered SQL query
    const users = await db.sequelize.query(
      `
      SELECT id, username, email, mobile, latitude, longitude,
        (
          6371 * acos(
            cos(radians(:lat)) *
            cos(radians(latitude)) *
            cos(radians(longitude) - radians(:lon)) +
            sin(radians(:lat)) *
            sin(radians(latitude))
          )
        ) AS distance
      FROM Users
      WHERE id != :userId
      ${connectedUserIds.length ? 'AND id NOT IN (:connectedIds)' : ''}
      HAVING distance <= :radius
      ORDER BY distance ASC
      `,
      {
        replacements: {
          lat: latitude,
          lon: longitude,
          radius: radiusInKm,
          userId: req.userId,
          connectedIds: connectedUserIds
        },
        type: Sequelize.QueryTypes.SELECT
      }
    );

    res.status(200).json(users);
  } catch (err) {
    console.error('Error getting nearby users:', err);
    res.status(500).json({ error: 'Server error while finding nearby users' });
  }
};

// controllers/userController.js
exports.updateLocation = async (req, res) => {
  try {
    const userId = req.user.id; // from verifyToken middleware
    const { latitude, longitude } = req.body;

    if (latitude == null || longitude == null) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    await db.User.update(
      { latitude, longitude },
      { where: { id: userId } }
    );

    res.status(200).json({ message: 'Location updated successfully' });
  } catch (err) {
    console.error('Location update error:', err);
    res.status(500).json({ error: 'Failed to update location' });
  }
};
