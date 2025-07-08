const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const connectionController = require('../controllers/connectionController');
const verifyToken = require('../middleware/verifyToken');

router.get('/nearby', verifyToken, userController.getNearbyUsers);

router.post('/connect', verifyToken, connectionController.sendConnectionRequest);

router.get('/requests', verifyToken, connectionController.getPendingRequests);

router.get('/requests/sent', verifyToken, connectionController.getSentRequests);

router.put('/requests/:id', verifyToken, connectionController.respondToRequest);

router.get('/connections', verifyToken, connectionController.getAcceptedConnections);

router.delete('/connections/:userId', verifyToken, connectionController.removeConnection);

router.patch('/update-location', verifyToken, userController.updateLocation);


module.exports = router;
