import { protect } from './middleware/authMiddleware.js';

export const authenticateToken = (req, res, next) => protect(req, res, next);