const express = require('express');
const router = express.Router();
const adminCtrl = require('../controller/adminctrl');
const { auth, role } = require('../middleware/auth');

router.get('/users', auth, role('admin'), adminCtrl.listUsers);
router.put('/users/:id', auth, role('admin'), adminCtrl.updateUserByAdmin);
router.delete('/users/:id', auth, role('admin'), adminCtrl.deleteUser);

module.exports = router;
