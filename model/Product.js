const { type } = require("@testing-library/user-event/dist/type");
const mongoose = require("mongoose");
const ProductConn = mongoose.createConnection("mongodb+srv://netbum21_db_user:3RmZzKbOhMOuZqFR@cluster0.v924yzi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/Products");

const ProductSchema = new mongoose.Schema({
    id: { type: Number, unique: true },
    name: { type: String, required: true },
    group: { type: String },
    image: { type: String, default: "" },     
    description: { type: String },
    stock: { 
        type: Number,
        required: true,
        default: 0
    },
    price: { type: Number , default: 0}
}, { timestamps: true });

const Product = ProductConn.model("Product", ProductSchema);

module.exports.saveProduct = async function(data) {
    try {
        const product = new Product(data);   
        const saved = await product.save();   
        return saved;
    } catch (err) {
        throw err;
    }
};

module.exports.deleteProduct = async function(productId) {
    try {
        const result = await Product.deleteOne({ id: productId });
        return result;
    } catch (err) {
        throw err;
    }
};

module.exports.editProduct = async function(data) {
    try {
        const result = await Product.updateOne({data});
        return result;
    } catch (err) {
        throw err;
    }
}

module.exports.Product = Product;
