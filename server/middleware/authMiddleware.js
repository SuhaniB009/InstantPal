import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  const auth = req.headers.authorization;

  if (auth && auth.startsWith('Bearer ')) {
    try {
      const token = auth.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      req.user = await User.findById(decoded.id).select('-password');

      // ✅ Add this check to ensure the user still exists
      if (req.user) {
        next(); // If user is found, proceed
      } else {
        // If user is null (e.g., deleted), send an error
        res.status(401).json({ error: 'Unauthorized - User not found' });
      }

    } catch (err) {
      res.status(401).json({ error: 'Unauthorized - Invalid token' });
    }
  } else {
    res.status(401).json({ error: 'Unauthorized - No token' });
  }
};