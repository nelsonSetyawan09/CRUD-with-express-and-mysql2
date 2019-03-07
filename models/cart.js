const fs = require('fs');
const path = require('path');
const rootDir = require('../util/path');

const p = path.join(rootDir, 'data', 'cart.json');

// let cart = {products: [{id:12, qty:1},{id:23, qty:0}], totalPrice: 45.9}
module.exports = class Cart{
    static addProduct(id, price){
        fs.readFile(p, (err,fileContent) =>{
            let cart = {products: [], totalPrice: 0};
            if(!err){
                cart = JSON.parse(fileContent);
            }
            let updateProduct;

            // check if cart dont have products property
            // otomatis product not exist, make new product and push it to cart.products
            if(cart.hasOwnProperty('products') == false){
                cart = {products: [], totalPrice: 0};
                updateProduct = {id, qty: 1};
                cart.products.push(updateProduct);

            // products property exist
            // check jika id ada or not
            }else{
                let existProductIndex = cart.products.findIndex(product => product.id == id);
                let existProduct = cart.products[existProductIndex];

                // if product exist, make update product qty
                if(existProduct){
                    updateProduct = {...existProduct}
                    updateProduct.qty +=1;
                    cart.products[existProductIndex] = updateProduct

                // id tdk ada (new product)
                // add new product
                }else{
                    updateProduct = {id, qty: 1};
                    cart.products.push(updateProduct);
                }
            }

            // update totalPrice and overwrite cart.json
            cart.totalPrice += Number(price);
            fs.writeFile(p,JSON.stringify(cart), err=>{
                if(err) console.log(err);
            });
        })
    }

    static deleteProduct(id,price){
        fs.readFile(p, (err,fileContent) =>{
            if(err) return;
            let carts = JSON.parse(fileContent);
            let findProduct = carts.products.find(cart => cart.id == id);
            if(!findProduct) return;
            let updateCart = carts.products.filter(cart => cart.id !== id); // bisa return [] (empty array) bila last product

            carts.products = [...updateCart];
            carts.totalPrice = carts.totalPrice - (findProduct.qty * price) // bisa hasilkan 0 (nol) bila last product

            fs.writeFile(p,JSON.stringify(carts), err=>{                    // carts = {products:[], totalPrice:0} bila last product di delete
                if(err) console.log(err);
            });
        })
    }

    static getCart(cb){
        fs.readFile(p, (err,fileContent) =>{
            if(err){
                cb(null)
            }else{
                let cart = JSON.parse(fileContent);
                cb(cart)
            };
        });
    }

};
















    //
