import express from 'express';
import {
  createOrder,
  getOrdersByHostel,
  joinOrder,
  lockOrder,
  getUserOrders,
  getOrderById, 
  deleteOrder 
} from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js'; // Multer middleware if you support QR uploads

const router = express.Router();

router.post('/create', protect, upload.single('qrImage'), createOrder);



router.get('/hostel', protect, getOrdersByHostel);



router.post('/join/:orderId', protect, joinOrder);

router.post('/lock/:orderId', protect, lockOrder);



router.get('/myorders', protect, getUserOrders);

router.get('/:id', protect, getOrderById);

router.delete('/:id', protect, deleteOrder);



export default router;