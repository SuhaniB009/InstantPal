import mongoose from 'mongoose';

// ✅ Chat message schema
const messageSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String, // store sender name for convenience
      required: true,
    },
    text: {
      type: String, // actual chat message
      required: true,
    },
  },
  { timestamps: true }
);

// ✅ Item schema (for order items)
const itemSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  link: { type: String }, // optional product link
});

// ✅ Main Order schema
const orderSchema = new mongoose.Schema(
  {
    initiatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    hostel: {
      type: String,
      required: true,
    },
    platform: {
      type: String,
      required: true,
    },
    upiId: {
      type: String,
    },
    optionalMessage: {
      type: String,
    },
    qrImage: {
      type: String,
    },
    items: [itemSchema],

    status: {
      type: String,
      enum: ['Open', 'Locked'],
      default: 'Open',
    },
    lockedAt: { type: Date },

    // ✅ Chat messages will persist until order is deleted
    chat: [messageSchema],

    joinedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);