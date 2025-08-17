import Order from '../models/Order.js';
import User from '../models/User.js';
// server/controllers/orderController.js
// ✅ Add message to an order's chat
export const addMessageToOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Message text is required" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const newMessage = {
      user: req.user._id,
      name: req.user.name,
      text,
    };

    order.chat.push(newMessage);
    await order.save();

    res.status(201).json(newMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send message" });
  }
};
export const createOrder = async (req, res) => {
  const { platform, upiId, optionalMessage } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    const newOrder = new Order({
      initiatedBy: user._id,
      hostel: user.hostel,
      platform,
      upiId,
      optionalMessage,
      qrImage: req.file ? req.file.filename : null,
      items: []
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (err) {
    console.error('Create Order Error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

export const getOrdersByHostel = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const hostel = user.hostel;
    const orders = await Order.find({ hostel, status: 'Open' })
      .populate('initiatedBy', 'name email')
      .populate('items.user', 'name email')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error('Get Orders Error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

export const joinOrder = async (req, res) => {
  const { orderId } = req.params;
  const { name, quantity, link } = req.body;
  const userId = req.user.id;

  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ msg: 'Order not found' });
    if (order.status === 'Locked') return res.status(403).json({ msg: 'Order is locked' });

    order.items.push({ user: userId, name, quantity, link });
    await order.save();

    const populatedOrder = await Order.findById(orderId)
      .populate('items.user', 'name email')
      .populate('initiatedBy', 'name email');

    res.json(populatedOrder);
  } catch (err) {
    console.error('Join Order Error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

export const lockOrder = async (req, res) => {
  const { orderId } = req.params;
  const userId = req.user.id;

  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ msg: 'Order not found' });

    if (order.initiatedBy.toString() !== userId) {
      return res.status(403).json({ msg: 'Only the initiator can lock the order' });
    }

    order.status = 'Locked';
    order.lockedAt = new Date();
    await order.save();
    res.json(order);
  } catch (err) {
    console.error('Lock Order Error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

export const getUserOrders = async (req, res) => {
  const userId = req.user.id;
  try {
    const orders = await Order.find({
      $or: [
        { initiatedBy: userId },
        { 'items.user': userId }
      ]
    })
    .populate('initiatedBy', 'name email')
    .populate('items.user', 'name email')
    .populate('chat.user', 'name') // ✅ Added this line to load chat user names
    .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error('Get User Orders Error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('initiatedBy', 'name email')
      .populate('items.user', 'name email')
      .populate('chat.user', 'name'); // ✅ Added this line to load chat user names

    if (!order) return res.status(404).json({ msg: 'Order not found' });
    res.json(order);
  } catch (err) {
    console.error('Get Order By ID Error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.user.id;
    const order = await Order.findById(orderId);

    if (!order) return res.status(404).json({ msg: 'Order not found' });

    const isInitiator = order.initiatedBy.toString() === userId.toString();
    const isParticipant = order.items.some(item => item.user.toString() === userId.toString());

    if (!isInitiator && !isParticipant) {
      return res.status(403).json({ msg: 'Not authorized to delete this order' });
    }

    if (isInitiator) {
      await Order.findByIdAndDelete(orderId);
      return res.status(200).json({ msg: 'Order deleted for all users in same hostel' });
    }

    if (isParticipant) {
      order.items = order.items.filter(item => item.user.toString() !== userId.toString());
      await order.save();
      return res.status(200).json({ msg: 'You have left the order' });
    }
  } catch (error) {
    console.error('Delete Order Error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};