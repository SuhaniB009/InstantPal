import express from 'express';
import {
  createOrder,
  getOrdersByHostel,
  joinOrder,
  lockOrder,
  getUserOrders,
  getOrderById,
  deleteOrder,
  addMessageToOrder, // REST fallback for chat
} from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Chat (REST fallback). Your frontend mainly uses socket.io + GET /:id for history.
router.post('/:orderId/chat', protect, addMessageToOrder);

// Orders
router.post('/create', protect, upload.single('qrImage'), createOrder);
router.get('/hostel', protect, getOrdersByHostel);
router.post('/join/:orderId', protect, joinOrder);
router.post('/lock/:orderId', protect, lockOrder);
router.get('/myorders', protect, getUserOrders);
router.get('/:id', protect, getOrderById);
router.delete('/:id', protect, deleteOrder);

export default router;