import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';
import { getProfile } from '../controllers/authController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router();

router.get('/profile', protect, getProfile)
router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;