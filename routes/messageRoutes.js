const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const verifyToken = require('../middleware/verifyToken');

router.post('/', verifyToken, messageController.sendMessage);
router.get('/:userId', verifyToken, messageController.getMessagesWithUser);

module.exports = router;
