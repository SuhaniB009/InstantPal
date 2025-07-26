import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// REGISTER
// controllers/authController.js



export const registerUser = async (req, res) => {
  try {
    const { name, rollNumber, email, password, hostel } = req.body;
    if (!/^[0-9]{4}[a-z]{4}[0-9]{3}@nitjsr\.ac\.in$/.test(email)) {
    return res.status(400).json({ error: 'Invalid college email format.' });
  }
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: 'User already exists' });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      name,
      rollNumber, // ✅ make sure this is passed
      email,
      password: hashedPassword,
      hostel
    });

    await newUser.save();

    // Create token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(201).json({ token, user: { id: newUser._id, name: newUser.name, email: newUser.email, hostel: newUser.hostel, rollNumber: newUser.rollNumber } });
  } catch (err) {
    console.error('Register Error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// LOGIN
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
      user: { id: user._id, name: user.name, email, hostel: user.hostel }
    });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

//GETPROFILE
export const getProfile = async (req, res) => {
  const user = req.user // Already set by the protect middleware

  if (user) {
    res.json({
      name: user.name,
      email: user.email,
      hostel: user.hostel,
      rollNumber: user.rollNumber,
    })
  } else {
    res.status(404).json({ error: 'User not found' })
  }
}
