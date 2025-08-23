// Compatibility shim: provide authenticateToken that uses the single protect.
import { protect } from './middleware/authMiddleware.js';

export const authenticateToken = (req, res, next) => protect(req, res, next);