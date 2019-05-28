const fs = require('fs');
const path= require('path');
const PDFDocument = require('pdfkit');


const Product = require('../models/product');
const Order = require('../models/order');

const ITEM_PER_PAGE = 2;

exports.getProducts = (req, res, next) => {
  const page = +req.query.page || 1;  // 1,2
  let totalProducts = 0;
  Product.find()
    .countDocuments()
    .then(numProducts =>{
      totalProducts = numProducts;
      return Product.find()
        .skip((page-1)*ITEM_PER_PAGE)
        .limit(ITEM_PER_PAGE);
    })
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products',
        hasNextPage: page*ITEM_PER_PAGE < totalProducts,
        hasPreviousPage : page >1,
        nextPage : page+1,
        previousPage: page-1,
        lastPage: Math.ceil(totalProducts/ITEM_PER_PAGE),
        firstPage: 1,
        currentPage: page
      });
    })
    .catch(err =>{
      const error = new Error(err);
      error.httpStatusCode = 500;
      //  next(error), men-skip all middleware and right a way to
      //  error handling middleware
      return next(error)
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products'
      });
    })
    .catch(err =>{
      const error = new Error(err);
      error.httpStatusCode = 500;
      //  next(error), men-skip all middleware and right a way to
      //  error handling middleware
      return next(error)
    });
};

exports.getIndex = (req, res, next) => {
  const page = +req.query.page || 1;  // 1,2
  let totalProducts = 0;
  Product.find()
    .countDocuments()
    .then(numProducts =>{
      totalProducts = numProducts;
      return Product.find()
        .skip((page-1)*ITEM_PER_PAGE)
        .limit(ITEM_PER_PAGE);
    })
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
        hasNextPage: page*ITEM_PER_PAGE < totalProducts,
        hasPreviousPage : page >1,
        nextPage : page+1,
        previousPage: page-1,
        lastPage: Math.ceil(totalProducts/ITEM_PER_PAGE),
        firstPage: 1,
        currentPage: page
      });
    })
    .catch(err =>{
      const error = new Error(err);
      error.httpStatusCode = 500;
      //  next(error), men-skip all middleware and right a way to
      //  error handling middleware
      return next(error)
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items;
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products
      });
    })
    .catch(err =>{
      const error = new Error(err);
      error.httpStatusCode = 500;
      //  next(error), men-skip all middleware and right a way to
      //  error handling middleware
      return next(error)
    });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(result => {
      console.log(result);
      res.redirect('/cart');
    })
    .catch(err =>{
      const error = new Error(err);
      error.httpStatusCode = 500;
      //  next(error), men-skip all middleware and right a way to
      //  error handling middleware
      return next(error)
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err =>{
      const error = new Error(err);
      error.httpStatusCode = 500;
      //  next(error), men-skip all middleware and right a way to
      //  error handling middleware
      return next(error)
    });
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items.map(i => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user
        },
        products: products
      });
      return order.save();
    })
    .then(result => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect('/orders');
    })
    .catch(err =>{
      const error = new Error(err);
      error.httpStatusCode = 500;
      //  next(error), men-skip all middleware and right a way to
      //  error handling middleware
      return next(error)
    });
};

exports.getOrders = (req, res, next) => {
  Order.find({ 'user.userId': req.user._id })
    .then(orders => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders
      });
    })
    .catch(err =>{
      const error = new Error(err);
      error.httpStatusCode = 500;
      //  next(error), men-skip all middleware and right a way to
      //  error handling middleware
      return next(error)
    });
};


exports.getInvoice = (req, res, next) =>{
  const orderId = req.params.orderId;

  Order.findById(orderId)
    .then(order =>{
      if(!order){
        return next(new Error('no order found!'))
      }
      if(order.user.userId.toString() !== req.user._id.toString()){
        return next(new Error('user not authorized'))
      }
      const invoiceName = 'invoice-'+orderId+'.pdf';
      const invoicePath = path.join('invoices', invoiceName);

      const pdfDoc = new PDFDocument();
      pdfDoc.pipe(fs.createWriteStream(invoicePath));
      pdfDoc.pipe(res);

      pdfDoc
        .font('Helvetica-Oblique')
        .fontSize(25)
        .text('Citra Sayang!!', 100, 100);  // 100,100 is postion top-bottom

      pdfDoc.text('--------------------');

      let totalPrice = 0;
      for(let product of order.products){
        totalPrice += product.product.price * product.quantity;
        let text = `title: ${product.product.title}
        price: $${product.product.price}
        quantity: ${product.quantity}`.replace(/  +/g, '');

        pdfDoc.fontSize(18).text(text);
      };

      pdfDoc.text('---------------');
      pdfDoc.text(`totalPrice : $${totalPrice}`);


      pdfDoc.end()

      // fs.readFile(invoicePath, (err, data) =>{
      //   if(err){
      //     const error = new Error(err);
      //     error.httpStatusCode = 500;
      //     //  next(error), men-skip all middleware and right a way to
      //     //  error handling middleware
      //     return next(error)
      //   }
      //   res.setHeader('Content-Type', 'application/pdf')
      //   // res.setHeader('Content-Disposition', `attachment; filename=${invoiceName}`)
      //   res.setHeader('Content-Disposition', `inline; filename=${invoiceName}`)
      //   res.send(data)
      // });

      // const file = fs.createReadStream(invoicePath);
      // res.setHeader('Content-Type', 'application/pdf')
      // // res.setHeader('Content-Disposition', `attachment; filename=${invoiceName}`)
      // res.setHeader('Content-Disposition', `inline; filename=${invoiceName}`)
      // file.pipe(res);
    })
    .catch(err =>{
      const error = new Error(err);
      //  next(error), men-skip all middleware and right a way to
      //  error handling middleware
      return next(error)
    });
}
