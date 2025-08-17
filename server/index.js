import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import http from 'http';
import path from 'path';

import authRoutes from './routes/auth.js';
import orderRoutes from './routes/orders.js';

import Order from './models/Order.js';
import User from './models/User.js';

const __dirname = path.resolve();
dotenv.config();

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  'http://localhost:5173',
  'https://instantpal-client.onrender.com'
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('CORS not allowed'), false);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true,
  optionsSuccessStatus: 200
};

const io = new Server(server, { cors: corsOptions });

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);

app.get('/', (_req, res) => {
  res.send('Instapal backend is running 🚀');
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

io.on('connection', (socket) => {
  console.log(`📡 User connected: ${socket.id}`);

  socket.on('join_order_room', (orderId) => {
    socket.join(orderId);
    console.log(`User ${socket.id} joined room ${orderId}`);
  });

  socket.on('leave_order_room', (orderId) => {
    socket.leave(orderId);
    console.log(`User ${socket.id} left room ${orderId}`);
  });

  socket.on('send_message', async ({ orderId, userId, text }) => {
    try {
      if (!orderId || !userId || !text?.trim()) return;

      const user = await User.findById(userId);
      if (!user) return;

      const message = {
        user: userId,
        name: user.name,
        text: text.trim(),
        createdAt: new Date()
      };

      const order = await Order.findByIdAndUpdate(
        orderId,
        { $push: { chat: message } },
        { new: true }
      );

      if (order) {
        const updatedOrder = await Order.findById(orderId)
          .populate('chat.user', 'name');

        const lastMessage = updatedOrder.chat[updatedOrder.chat.length - 1];
        io.to(orderId).emit('receive_message', lastMessage);
      }
    } catch (error) {
      console.error('Error handling message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log(`🔌 User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));