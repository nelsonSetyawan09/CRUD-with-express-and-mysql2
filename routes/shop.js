const path = require('path');

const express = require('express');
const router = express.Router();


const shopController = require('../controllers/shop');

//  /   =>GET
router.get('/',shopController.getIndex);

//  /products   =>GET
router.get('/products', shopController.getProducts);

// /products/0.453453
router.get('/products/:productId', shopController.getProduct);

router.get('/cart', shopController.getCart);

router.post('/cart', shopController.postCart);

router.post('/cart-delete-item', shopController.postDeleteCart)

module.exports = router;
