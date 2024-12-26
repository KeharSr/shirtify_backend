const router = require('express').Router();
const productController = require('../controllers/productController');
const { authGuard, adminGuard } = require('../middleware/authGuard');

router.post('/create', productController.createProduct);

module.exports = router;