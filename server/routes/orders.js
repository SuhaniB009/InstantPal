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
// server/routes/orders.js
import { addMessageToOrder } from '../controllers/orderController.js';

// ✅ Route to send chat message
const router = express.Router();
router.post('/:orderId/chat', protect, addMessageToOrder);

// Get messages of an order
router.get('/:id/messages', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order.messages);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Send a new message
router.post('/:id/messages', protect, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: "Message cannot be empty" });

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const newMessage = {
      sender: req.user.name, // Assuming user model has `name`
      text,
    };

    order.messages.push(newMessage);
    await order.save();

    res.json(newMessage);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post('/create', protect, upload.single('qrImage'), createOrder);



router.get('/hostel', protect, getOrdersByHostel);



router.post('/join/:orderId', protect, joinOrder);

router.post('/lock/:orderId', protect, lockOrder);



router.get('/myorders', protect, getUserOrders);

router.get('/:id', protect, getOrderById);

router.delete('/:id', protect, deleteOrder);



export default router;