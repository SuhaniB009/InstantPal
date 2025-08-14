// server/index.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import http from 'http';
import path from 'path';

import authRoutes from './routes/auth.js';
import orderRoutes from './routes/orders.js';

const __dirname = path.resolve();
dotenv.config();

const app = express();
const server = http.createServer(app);

// ✅ Only your deployed client is allowed (remove localhost to avoid confusion)
const allowedOrigins = [
  'http://localhost:5173',
  'https://instantpal-client.onrender.com'
].filter(Boolean);

// ✅ CORS options shared by Express & Socket.IO
const corsOptions = {
  origin: (origin, callback) => {
    // allow non-browser tools (no origin) and your allowed client
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('CORS not allowed'), false);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true,
  optionsSuccessStatus: 200
};

const io = new Server(server, { cors: corsOptions });

// Static files (if any)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());

// Routes (note /api prefix)
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);

// Health check
app.get('/', (_req, res) => {
  res.send('Instapal backend is running 🚀');
});

// MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Socket.IO events
io.on('connection', (socket) => {
  console.log(`📡 User connected: ${socket.id}`);
  socket.on('disconnect', () => console.log(`🔌 User disconnected: ${socket.id}`));
});

// Start
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
