const express = require('express');
const router = express.Router();
const categoryCtrl = require('../controller/categoryctrl');
const { auth, role } = require('../middleware/auth');

router.get('/', auth, categoryCtrl.listCategories);

router.post('/', auth, role('admin'), categoryCtrl.createCategory);
router.put('/:id', auth, role('admin'), categoryCtrl.updateCategory);
router.delete('/:id', auth, role('admin'), categoryCtrl.deleteCategory);

module.exports = router;
