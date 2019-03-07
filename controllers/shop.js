const Product = require('../models/product');
const Cart = require('../models/cart');
// let cart = {products: [{id:12, qty:1},{id:23, qty:0}], totalPrice: 45.9}

// path di sini cuma tambahan info
// buat class active bootstrap
// bukan path url
// path url ada di routes
exports.getIndex = (req, res, next) =>{
    Product.fetchAll()
        .then(([products, dataFields]) =>{
            res.render('shop/index', {
                products,
                docTitle: 'Shop',
                path:'/',
                hasProducts: products.length>0
            })
        })
        .catch(err => console.log(err));
};

exports.getProducts = (req,res,next)=>{
    Product.fetchAll()
        .then(([products, dataFields]) => {
            res.render('shop/product-list', {
                products,
                docTitle: 'All Products',
                path: '/products',
                hasProducts: products.length>0
            })
        })
        .catch(err => console.log(err));
};

exports.getProduct = (req,res) =>{
    let productId = req.params.productId;
    Product.findById(productId)
        .then( ([product]) =>{
            res.render('shop/product-details', {
                product: product[0],
                docTitle: product[0].title,
                path: '/products'
                // hasProduct: product.length>0
            })
        })
        .catch(err => console.log(err));
}

exports.getCart = (req, res, next) =>{
    Cart.getCart(cart =>{
        Product.fetchAll()
            .then(([products, dataFields]) =>{
                let cartProducts=[]
                // buat loop tiap product dlm products
                for(let product of products){
                    // temukan satu object di dlm cart.products yg memiliki id sm dgn product.id
                    let findProduct = cart.products.find(prod => Number(prod.id) === product.id);

                    // jika ketemu, buat new object dan push ke dlm cartProducts
                    if(findProduct){
                        cartProducts.push({productData: product, qty: findProduct.qty})
                    }
                }
                res.render('shop/cart', {
                    path: '/cart',
                    docTitle: 'Your Cart',
                    products: cartProducts
                })
            }).catch(err => console.log(err))
    });
};

exports.postCart = (req,res) =>{
    // came from input in form (shop/cart.ejs)
    let productId = req.body.productId;
    Product.findById(productId)
        .then(([product]) =>{
            Cart.addProduct(productId, product[0].price);
            res.redirect('/');
        }).catch(err => console.log(err))
};

exports.postDeleteCart = (req,res) =>{
    let productId = req.body.productId;
    Product.findById(productId)
        .then(([product]) =>{
            Cart.deleteProduct(productId, product.price);
            res.redirect('/cart');
        }).catch(err => console.log(err))
};
