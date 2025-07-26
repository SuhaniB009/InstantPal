//controllers/orderController.js

import Order from '../models/Order.js';

import User from '../models/User.js';



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

qrImage: req.file ? req.file.filename : null, // gets filename from multer

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

const user = await User.findById(req.user.id); // Get user from JWT

if (!user) return res.status(404).json({ msg: 'User not found' });



const hostel = user.hostel;



const orders = await Order.find({ hostel, status: 'Open' }) // You can remove `status: 'Open'` if not needed

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



// Return populated order

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

.populate('initiatedBy', 'name email') // initiator details

.populate('items.user', 'name email') // joined user details

.sort({ createdAt: -1 });



res.json(orders);

} catch (err) {

console.error('Get User Orders Error:', err);

res.status(500).json({ msg: 'Server error' });

}

};