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

// ✅ Update allowed origins (include both local + deployed frontend)
const allowedOrigins = [
  'http://localhost:5173',
  'https://instantpal-client.onrender.com'
];

// ✅ Better CORS handling
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('Blocked by CORS:', origin);
      callback(new Error('CORS not allowed'));
    }
  },
  credentials: true,
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);

app.get('/', (_req, res) => {
  res.send('Instapal backend is running 🚀');
});

// MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// ✅ Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

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
        createdAt: new Date(),
      };

      await Order.findByIdAndUpdate(
        orderId,
        { $push: { chat: message } },
        { new: true }
      );

      const updatedOrder = await Order.findById(orderId).populate(
        'chat.user',
        'name'
      );

      const lastMessage =
        updatedOrder.chat[updatedOrder.chat.length - 1];
      io.to(orderId).emit('receive_message', lastMessage);
    } catch (error) {
      console.error('Error handling message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log(`🔌 User disconnected: ${socket.id}`);
  });
});

// Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));