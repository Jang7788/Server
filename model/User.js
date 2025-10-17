const mongoose = require('mongoose');
const { type } = require('@testing-library/user-event/dist/type');

const userConn = mongoose.createConnection("mongodb+srv://netbum21_db_user:3RmZzKbOhMOuZqFR@cluster0.v924yzi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/users");

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  email: { type: String, unique: true },
  password: String,
  role : {type : String, default : "user"}
});

const User = userConn.model("User",userSchema);

module.exports = User;