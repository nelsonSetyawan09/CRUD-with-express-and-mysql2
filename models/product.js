const db = require('../util/database');

// class Product
module.exports = class Product{
    constructor(id, title, imageUrl, description, price){
        this.id=id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    } // end constructor

    save(){
        // we return promise mysql
        return db.execute(
            'INSERT INTO products (title, price, imageUrl, description) VALUES(?,?,?,?)',
            [this.title, this.price, this.imageUrl, this.description]
        );
    } //end save
    editById(){
        return db.execute(
            'UPDATE products SET title=?, price=?, imageUrl=?, description=? WHERE id=?',
            [this.title, this.price, this.imageUrl, this.description, this.id]
        )
    }
    static deleteById(id){
        return db.execute(
            'DELETE FROM products WHERE id=?',
            [id]
        );
    } // end deleteById

    static fetchAll(){
        return db.execute('select * from products') // return promise data
    } // end fetchAll

    static findById(id){
        return db.execute(
            'select * from products where id=?',
            [id]
        );
    } // end findById

} //end class Product









//
