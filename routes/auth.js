const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../model/User"); 
const jwt = require('jsonwebtoken');

router.post("/register", async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบถ้วน" });
    }

    try {
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(409).json({ message: "อีเมลนี้มีผู้ใช้งานแล้ว" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });
        const savedUser = await newUser.save();
        const payload = {
            user: {
                id: savedUser.id
            }
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({
            message: "ลงทะเบียนและเข้าสู่ระบบสำเร็จ!",
            token: token,
            user: {
                _id: savedUser._id,
                username: savedUser.username,
                email: savedUser.email,
            }
        });

    } catch (err) {
        console.error("Registration Error:", err);
        res.status(500).json({ message: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์" });
    }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ msg: "No user" });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ msg: "Wrong password" });
  req.session.user = { 
    _id: user._id, 
    username: user.username, 
    email: user.email,
    role: user.role 
  };

  res.json({ msg: "Logged in!", user: req.session.user });
});

router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Could not log out." });
    }
    res.clearCookie("connect.sid");
    res.json({ msg: "Logged out" });
  });
});

router.get("/me", (req, res) => {
    if (req.session.user) {
        res.json({ loggedIn: true, user: req.session.user });
    } else {
        res.json({ loggedIn: false });
    }
});


module.exports = router;
