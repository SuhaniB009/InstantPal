import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const registerUser = async (req, res) => {
  try {
    const { name, rollNumber, email, password, hostel, roomNumber } = req.body;


    if (!/^[0-9]{4}[a-z]{4}[0-9]{3}@nitjsr\.ac\.in$/.test(email)) {
      return res.status(400).json({ error: 'Invalid college email format.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ name, rollNumber, email, password: hashedPassword, hostel, roomNumber });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      success: true,
      msg: 'Registration successful',
      token,
      redirectTo: '/dashboard',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        hostel: newUser.hostel,
        rollNumber: newUser.rollNumber,
        roomNumber: newUser.roomNumber
      }
    });
  } catch (err) {
    console.error('Register Error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ msg: 'Email and password required' });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        hostel: user.hostel,
        roomNumber: user.roomNumber
      }
    });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

export const getProfile = async (req, res) => {
  const user = req.user; 
  if (user) {
    res.json({
      name: user.name,
      email: user.email,
      hostel: user.hostel,
      rollNumber: user.rollNumber,
      roomNumber: user.roomNumber,
      id: user._id
    });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
};