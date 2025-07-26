//routes/orders.js
import express from 'express';
import {
  createOrder,
  getOrdersByHostel,
  joinOrder,
  lockOrder,
  getUserOrders
} from '../controllers/orderController.js';

import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js'; // Multer middleware for file upload

const router = express.Router();

// 📦 Create a new order with optional QR image upload
router.post('/create', protect, upload.single('qrImage'), createOrder);

// 📍 Get all open orders for a particular hostel
router.get('/hostel/:hostel', protect, getOrdersByHostel);

// ➕ Join an existing order by ID
router.post('/join/:orderId', protect, joinOrder);
router.get('/hostel', protect, getOrdersByHostel);
// 🔒 Lock an order so others can't join
router.post('/lock/:orderId', protect, lockOrder);

// 👤 Get all orders the user has initiated or joined
router.get('/myorders', protect, getUserOrders);

export default router;