const db = require('../models');
const Connection = db.Connection;

exports.sendConnectionRequest = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { receiverId } = req.body;

    if (senderId === receiverId) {
      return res.status(400).json({ message: 'You cannot connect with yourself' });
    }

    // Check if already exists
    const existing = await Connection.findOne({
      where: {
        senderId,
        receiverId
      }
    });

    if (existing) {
      return res.status(400).json({ message: 'Connection request already sent' });
    }

    await Connection.create({ senderId, receiverId });
    res.status(201).json({ message: 'Connection request sent' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getPendingRequests = async (req, res) => {
  try {
    const receiverId = req.user.id;

    const requests = await db.Connection.findAll({
      where: {
        receiverId,
        status: 'pending'
      },
      include: [
        {
          model: db.User,
          as: 'Sender', // 👈 Use the exact alias here
          attributes: ['id', 'username', 'email']
        }
      ]
    });

    res.status(200).json(requests);
  } catch (err) {
    console.error('🔴 Error in getPendingRequests:', err);
    res.status(500).json({ message: 'Server error fetching pending requests' });
  }
};

exports.getSentRequests = async (req, res) => {
  try {
    const senderId = req.user.id;

    const sent = await db.Connection.findAll({
      where: { senderId },
      include: [{
        model: db.User,
        as: 'Receiver',
        attributes: ['id', 'username', 'email']
      }]
    });

    res.status(200).json(sent);
  } catch (err) {
    console.error('Error fetching sent requests:', err);
    res.status(500).json({ message: 'Server error fetching sent requests' });
  }
};

exports.respondToRequest = async (req, res) => {
  try {
    const receiverId = req.user.id;
    const connectionId = req.params.id;
    const { status } = req.body;

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const connection = await db.Connection.findOne({
      where: { id: connectionId, receiverId }
    });

    if (!connection) {
      return res.status(404).json({ message: 'Connection request not found' });
    }

    connection.status = status;
    await connection.save();

    res.status(200).json({ message: `Request ${status}` });
  } catch (err) {
    console.error('Error responding to request:', err);
    res.status(500).json({ message: 'Server error responding to request' });
  }
};

exports.getAcceptedConnections = async (req, res) => {
  try {
    const userId = req.user.id;

    const connections = await db.Connection.findAll({
      where: {
        status: 'accepted',
        [db.Sequelize.Op.or]: [
          { senderId: userId },
          { receiverId: userId }
        ]
      },
      include: [
        {
          model: db.User,
          as: 'Sender',
          attributes: ['id', 'username', 'email']
        },
        {
          model: db.User,
          as: 'Receiver',
          attributes: ['id', 'username', 'email']
        }
      ]
    });

    // const result = connections.map(conn => {
    //   const otherUser = conn.senderId === userId ? conn.Receiver : conn.Sender;
    //   return {
    //     id: otherUser.id,
    //     username: otherUser.username,
    //     email: otherUser.email,
    //     connectedAt: conn.updatedAt
    //   };
    // });
    const result = connections.map(conn => {
    let otherUser = null;

    if (conn.senderId === userId && conn.Receiver) {
        otherUser = conn.Receiver;
    } else if (conn.receiverId === userId && conn.Sender) {
        otherUser = conn.Sender;
    }

    return otherUser && {
        id: otherUser.id,
        username: otherUser.username,
        email: otherUser.email,
        connectedAt: conn.updatedAt
    };
    }).filter(Boolean); // remove any null entries

    res.status(200).json(result);
  } catch (err) {
    console.error('🔴 Error fetching accepted connections:', err);
    res.status(500).json({ error: 'Server error fetching accepted connections' });
  }
};

exports.removeConnection = async (req, res) => {
  try {
    const userId = req.user.id;
    const otherUserId = parseInt(req.params.userId, 10);

    if (userId === otherUserId) {
      return res.status(400).json({ message: 'You cannot remove yourself.' });
    }

    const connection = await db.Connection.findOne({
      where: {
        [db.Sequelize.Op.or]: [
          { senderId: userId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: userId }
        ],
        status: 'accepted'
      }
    });

    if (!connection) {
      return res.status(404).json({ message: 'No accepted connection found to remove.' });
    }

    await connection.destroy();
    res.status(200).json({ message: 'Connection removed successfully.' });
  } catch (err) {
    console.error('Error removing connection:', err);
    res.status(500).json({ message: 'Server error while removing connection.' });
  }
};

