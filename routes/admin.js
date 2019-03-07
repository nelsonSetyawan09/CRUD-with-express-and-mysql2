const path = require('path');
const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin');

//  /admin/add-product  => GET
router.get('/add-product', adminController.getAddProduct);

//  /admin/products
router.get('/products', adminController.getProducts);

//  /admin/add-product  => POST
router.post('/add-product',adminController.postAddProduct);

//  /admin/edit-product/0.4534535  => GET
router.get('/edit-product/:productId', adminController.getEditProduct);

//  /admin/edit-product/0.4534535  => POST
router.post('/edit-product',adminController.postEditProduct);

// /admin/delete-product
router.post('/delete-product', adminController.postDeleteProduct);

module.exports=router;
