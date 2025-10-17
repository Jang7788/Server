const express = require("express");
const session = require("express-session");
const cors = require("cors");
const MongoStore = require("connect-mongo"); 
const path = require('path'); 
const PORT = 3600;
const authRoutes = require("./routes/auth")       
const productRoutes = require('./routes/product');  
const cartRoutes = require('./routes/cart');      
const app = express();

app.use(express.json());

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(
  session({
    secret: "sskibidi_toilet_1234_secret_keyfdsffgh21fgh21h2fg1",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: "mongodb+srv://netbum21_db_user:3RmZzKbOhMOuZqFR@cluster0.v924yzi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0" }),
    cookie: {
      httpOnly: true,
      secure: false, 
      maxAge: 1000 * 60 * 60 * 3, 
    },
  })
);


console.log("Registering routes...");

app.use('/api/auth', authRoutes);      
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);         
console.log("Routes registered successfully.");


app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));