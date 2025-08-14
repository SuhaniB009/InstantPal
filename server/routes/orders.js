// server/routes/orders.js
import express from 'express';
import {
  createOrder,
  getOrdersByHostel,
  joinOrder,
  lockOrder,
  getUserOrders
} from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js'; // Multer middleware if you support QR uploads

const router = express.Router();

// Create new order (optionally with QR image)
router.post('/create', protect, upload.single('qrImage'), createOrder);

// Get all open orders for the current user's hostel
// Controller should read hostel from req.user (recommended)
router.get('/hostel', protect, getOrdersByHostel);

// Join order
router.post('/join/:orderId', protect, joinOrder);

// Lock order
router.post('/lock/:orderId', protect, lockOrder);

// Get orders (initiated or joined by current user)
router.get('/myorders', protect, getUserOrders);

export default router;