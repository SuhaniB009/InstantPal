import jwt from 'jsonwebtoken';
import User from '../models/User.js';
export const protect = async (req, res, next) => {
  const auth = req.headers.authorization;

  if (auth && auth.startsWith('Bearer ')) {
    try {
      const token = auth.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized - User not found' });
      }
      req.user = user;
      if (!req.user.id) req.user.id = user._id;

      next();
    } catch (err) {
      console.error('Auth error:', err);
      res.status(401).json({ error: 'Unauthorized - Invalid token' });
    }
  } else {
    res.status(401).json({ error: 'Unauthorized - No token' });
  }
};