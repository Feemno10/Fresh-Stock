const express = require('express');
const router = express.Router();
const userCtrl = require('../controller/userctrl');
const { auth } = require('../middleware/auth');

router.get('/profile', auth, userCtrl.getProfile);
router.put('/profile', auth, userCtrl.updateProfile);

module.exports = router;
