const express = require('express');
const dataController = require('../controllers/dataController');
const authUtils = require('../utils/authUtils');

const router = express.Router();

router.post('/data', authUtils.verifyToken, dataController.storeData);
router.get('/data/:key', authUtils.verifyToken, dataController.retrieveData);
router.put('/data/:key', authUtils.verifyToken, dataController.updateData);
router.delete('/data/:key', authUtils.verifyToken, dataController.deleteData);

module.exports = router;
