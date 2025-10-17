const express = require("express");
const router = express.Router();
const { Product, deleteProduct } = require("../model/Product"); 
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

router.get("/allproduct", async (req, res) => {
    try {
        const allProducts = await Product.find();
        res.json(allProducts);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error while fetching products." });
    }
});

router.get("/getproduct/:id", async (req, res) => {
    try {
        const productData = await Product.findOne({ id: req.params.id });
        if (!productData) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(productData);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error while fetching product." });
    }
});

router.post("/addproduct", upload.single('image'), async (req, res) => { 
  try {
    const newProduct = new Product({
      id: req.body.id,
      name: req.body.name,
      group: req.body.group,
      image: req.body.image,
      description: req.body.description,
      stock: req.body.stock,
      price: req.body.price
    });
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    console.error("Error adding product:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการบันทึกข้อมูล" });
  }
});

router.put("/editproduct/:id", async (req, res) => {
    try {
        const updatedProduct = await Product.findOneAndUpdate(
            { id: req.params.id }, 
            req.body,              
            { new: true }          
        );
        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(updatedProduct);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "เกิดข้อผิดพลาดในการอัปเดตข้อมูล" });
    }
});

router.delete("/deleteproduct/:id", async (req, res) => {
    try {
        const productId = req.params.id;
        const deleteResult = await Product.findOneAndDelete({ id: productId });
        if (!deleteResult) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "เกิดข้อผิดพลาดในการลบข้อมูล" });
    }
});

module.exports = router;