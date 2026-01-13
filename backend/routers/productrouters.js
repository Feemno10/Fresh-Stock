const router = require('express').Router();
const ctrl = require('../controller/productctrl');
const { auth, role } = require('../middleware/auth');

router.get('/', auth, ctrl.listProducts);
router.get('/low-stock', auth, ctrl.lowStock);

router.post('/', auth, role('admin','staff'), ctrl.createProduct);
router.put('/:id', auth, role('admin','staff'), ctrl.updateProduct);
router.delete('/:id', auth, role('admin'), ctrl.deleteProduct);

router.post('/:id/stock', auth, role('admin','staff'), ctrl.updateStock);

module.exports = router;