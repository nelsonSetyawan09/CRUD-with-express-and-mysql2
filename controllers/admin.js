const Product = require('../models/product');


// path di sini cuma tambahan info
// buat class active bootstrap
// bukan path url
// path url ada di routes
exports.getAddProduct = (req,res,next)=>{
    res.render('admin/edit-product', {
        docTitle:'add-product',
        path:'/admin/add-product',
        editing: false
    });
};

exports.postDeleteProduct = (req,res,next) =>{
    let productId = req.body.productId;
    Product.deleteById(productId)
        .then(() =>{
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));
}

exports.getEditProduct = (req,res,next)=>{
    let editMode = req.query.edit;  // came from express
    if(!editMode){
        return res.redirect('/')
    }
    let _editMode=false
    if(editMode == 'true'){ _editMode=true}
    let productId = req.params.productId;
    Product.findById(productId)
        .then(([product]) =>{
            if(!product){
                return res.redirect('/')
            }
            res.render('admin/edit-product', {
                product: product[0],
                docTitle:'edit-product',
                path:'/admin/edit-product',
                editing: _editMode
            });
        })
        .catch(err => console.log(err));
};

// https://cdn.pixabay.com/photo/2016/03/31/20/51/book-1296045_960_720.png
exports.postAddProduct =  (req,res,next) =>{
    // req.body.title, req.body.imageUrl
    // itu bisa diketahui oleh javascript
    // berkat ada menambahan attribute name pada element html
    let {title, imageUrl, price, description} = req.body;
    const product = new Product(null,title, imageUrl, description, price);
    product.save()
        .then(() =>{
            res.redirect('/');
        })
        .catch(err => console.log(err));
};

exports.postEditProduct =  (req,res,next) =>{
    // req.body.title, req.body.imageUrl
    // itu bisa diketahui oleh javascript
    // berkat ada menambahan attribute name pada element html
    let {productId,title, imageUrl, price, description} = req.body;
    const product = new Product(productId, title, imageUrl, description, price);
    product.editById()
        .then(()=>{
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));
};

exports.getProducts = (req,res,next) =>{
    Product.fetchAll()
        .then(([products, dataFields]) =>{
            res.render('admin/products', {
                products,
                docTitle: 'Admin Products',
                path:'/admin/products',
                hasProducts: products.length>0
            });
        })
        .catch(err => console.log(err));
}
