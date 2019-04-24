const mongoose =  require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
	// _id otomatis dibuat oleh mongoose
	title: String,
	price: Number,
	imageUrl: String,
	description: String,
	userId:{
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	}
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;