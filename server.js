const express = require("express");
const session = require("express-session");
const cors = require("cors");
const MongoStore = require("connect-mongo");
const path = require('path');

const PORT = process.env.PORT || 3600;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

const authRoutes = require("./routes/auth");
const productRoutes = require('./routes/product');
const cartRoutes = require('./routes/cart');

const app = express();
app.use(express.json());

// CORS
const allowedOrigins = [
  "http://localhost:3000",
  "https://shop-demo-umber.vercel.app" // frontend deploy
];

app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true); // allow Postman / server-to-server
    if(!allowedOrigins.includes(origin)){
      return callback(new Error('CORS policy does not allow this origin'), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Session
app.use(
  session({
    secret: "sskibidi_toilet_1234_secret_keyfdsffgh21fgh21h2fg1",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ 
      mongoUrl: "mongodb+srv://netbum21_db_user:3RmZzKbOhMOuZqFR@cluster0.v924yzi.mongodb.net/sessions?retryWrites=true&w=majority" 
    }),
    cookie: {
      httpOnly: true,
      secure: true,      // สำหรับ HTTPS frontend
      sameSite: "none",  // cross-site cookie
      maxAge: 1000 * 60 * 60 * 3,
    },
  })
);

console.log("Registering routes...");

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);

console.log("Routes registered successfully.");

// Listen
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
