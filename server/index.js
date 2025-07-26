//server/index.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import http from 'http';
import authRoutes from './routes/auth.js';
import orderRoutes from './routes/orders.js';
import path from 'path';
const __dirname = path.resolve();
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST']
  }
});
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
app.use(cors({
  origin: process.env.CLIENT_URL
}));
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Test Route
app.get('/', (req, res) => {
  res.send('Instapal backend is running 🚀');
});

// Socket.IO setup (stub)
io.on('connection', (socket) => {
  console.log(`📡 User connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`🔌 User disconnected: ${socket.id}`);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});