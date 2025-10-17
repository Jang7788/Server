const mongoose = require("mongoose");
const ProductConn = mongoose.createConnection("mongodb+srv://netbum21_db_user:3RmZzKbOhMOuZqFR@cluster0.v924yzi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/carts");

const cartItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1, 
        default: 1
    }
});

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true,
        unique: true 
    },
    items: [cartItemSchema],
}, { 
    timestamps: true 
});

const Cart = ProductConn.model("Cart", cartSchema);

module.exports = Cart;
