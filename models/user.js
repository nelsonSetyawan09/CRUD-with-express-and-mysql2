const mongoose = require('mongoose');

const Schema =  mongoose.Schema;

const userSchema = new Schema({
	name: {
		type: String,
		required : true
	}, 
	email:{
		type: String,
		required: true
	},
	cart: {
		items: [
			{
				productId: {type: Schema.Types.ObjectId, ref: 'Product',required: true },
				quantity: {type:Number, required:true}
			}
		]
	}
});

userSchema.methods.addToCart = function(product){
	const cartProductIndex = this.cart.items.findIndex(cartProductUser =>{
		return cartProductUser.productId.toString() === product._id.toString()
	}); 
	let updateQuantity = 1;
	let updateItems =  [...this.cart.items]

	// klw ada, tinggal update quantitynya +1
	if(cartProductIndex >=0){
		updateQuantity = this.cart.items[cartProductIndex].quantity +1;
		updateItems[cartProductIndex].quantity = updateQuantity

	// klw tdk ada, push productnya
	}else{
		updateItems.push({
			productId: product._id,
			quantity: 1
		})
	}
	this.cart = {items: updateItems};
	return this.save(); //kita gunakan return krn masih ada penggunaan `then` berikutnya

}

userSchema.methods.deleteItemFromCart = function(prodId){
	let updateItems = this.cart.items.filter(item=> item.productId.toString() !== prodId.toString());
	this.cart = {items: updateItems};
	return this.save();
}

userSchema.methods.clearCart = function(){
	this.cart = {items:[]};
	return this.save();
}

const User = mongoose.model('User', userSchema);
module.exports = User;