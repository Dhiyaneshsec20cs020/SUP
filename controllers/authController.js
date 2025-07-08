const db = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.register = async (req, res) => {
  const { username, email, mobile, password, latitude, longitude } = req.body;

  try {
    // Check if user already exists
    const existingUser = await db.User.findOne({
      where: {
        username: username
      }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Username already taken' });
    }

    const existingEmail = await db.User.findOne({
      where: {
        email: email
      }
    });

    if (existingEmail) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const existingMobile = await db.User.findOne({
      where: {
        mobile: mobile
      }
    });

    if (existingMobile) {
      return res.status(400).json({ error: 'Mobile number already registered' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await db.User.create({
      username,
      email,
      mobile,
      password: hashedPassword,
      latitude,
      longitude
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        mobile: newUser.mobile,
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Server error during registration' });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user by username
    const user = await db.User.findOne({
      where: { username: username }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }
    user.latitude = req.body.latitude;
    user.longitude = req.body.longitude;
    await user.save();
    // Generate JWT
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '2h'
    });

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        mobile: user.mobile,
        latitude: user.latitude,
        longitude: user.longitude,
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
};
