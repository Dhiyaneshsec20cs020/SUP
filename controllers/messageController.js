const db = require('../models');

exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body;

    const message = await db.Message.create({
      senderId: req.userId,
      receiverId,
      content
    });

    res.status(201).json(message);
  } catch (err) {
    console.error('Error sending message:', err);
    res.status(500).json({ error: 'Failed to send message' });
  }
};

exports.getMessagesWithUser = async (req, res) => {
  try {
    const otherUserId = req.params.userId;
    const currentUserId = req.userId;

    const messages = await db.Message.findAll({
      where: {
        [db.Sequelize.Op.or]: [
          { senderId: currentUserId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: currentUserId }
        ]
      },
      order: [['createdAt', 'ASC']]
    });

    res.status(200).json(messages);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};
