import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import AvailableOrders from '../components/AvailableOrders';
import MyOrders from '../components/MyOrders';
import api from '../utils/api';

// --- MODAL COMPONENT ---
const JoinOrderModal = ({ order, isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [link, setLink] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !quantity) {
      setError('Item name and quantity are required.');
      return;
    }
    setError('');
    onSubmit({ name, quantity, link });
  };

  const handleClose = () => {
    setName('');
    setQuantity(1);
    setLink('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-2">Join Order</h2>
        <p className="mb-4">
          Add your item to the <span className="font-semibold">{order.platform}</span> order.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Item Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
              placeholder="e.g., Lays Magic Masala"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Item Link (Optional)</label>
            <input
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
              placeholder="https://... product link"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Quantity</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
              min="1"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-yellow-400 text-black font-semibold px-4 py-2 rounded-md hover:bg-yellow-500"
            >
              Add to Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- MAIN DASHBOARD COMPONENT ---
const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [allOrders, setAllOrders] = useState([]);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [platform, setPlatform] = useState('Blinkit');
  const [items, setItems] = useState('');
  const [upi, setUpi] = useState('');

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const config = useMemo(() => ({
    headers: { Authorization: `Bearer ${token}` },
  }), [token]);

  const fetchData = async () => {
    try {
      const res = await api.get('/auth/profile', config);
      setUser(res.data);
      const orderRes = await api.get('/orders/hostel', config);
      setAllOrders(orderRes.data);
    } catch (err) {
      console.error(err);
      navigate('/login');
    }
  };

  useEffect(() => {
    if (token) fetchData();
    else navigate('/login');
  }, [navigate, token]);

  const myOrders = useMemo(() => {
    if (!user || !allOrders.length) return [];
    return allOrders.filter(order =>
      order.initiatedBy?.email === user.email
    );
  }, [user, allOrders]);

  const availableOrders = useMemo(() => {
    if (!user || !allOrders.length) return [];
    return allOrders.filter(order =>
      order.initiatedBy?.email !== user.email
    );
  }, [user, allOrders]);

  const handleStartOrder = async () => {
    try {
      await api.post('/orders/create', { platform, items, upi }, config);
      fetchData();
      setItems('');
      setUpi('');
    } catch (err) {
      alert('Error creating order');
    }
  };

  const handleOpenJoinModal = (order) => {
    setSelectedOrder(order);
    setIsJoinModalOpen(true);
  };

  const handleCloseJoinModal = () => {
    setIsJoinModalOpen(false);
    setSelectedOrder(null);
  };

  const handleJoinSubmit = async (formData) => {
    if (!selectedOrder) return;
    try {
      await api.post(`/orders/join/${selectedOrder._id}`, formData, config);
      fetchData();
      handleCloseJoinModal();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to join order.');
    }
  };

  const handleLock = async (orderId) => {
    // ... (Your existing lock logic)
  };

  const handleDelete = async (orderId) => {
    // ... (Your existing delete logic)
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <Header user={user} />
      
      {/* The Available Orders section */}
      <AvailableOrders
        orders={availableOrders}
        onJoinClick={handleOpenJoinModal}
      />

      {/* The "Start New Order" form is now here */}
      <div className="bg-gray-100 p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">➕ Start a New Group Order</h2>
        <div className="grid gap-4">
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="p-2 border rounded-lg"
          >
            <option>Blinkit</option>
            <option>Swiggy</option>
            <option>Zomato</option>
            <option>Annapurna</option>
          </select>
          <input
            type="text"
            placeholder="Add your first item(s)"
            value={items}
            onChange={(e) => setItems(e.target.value)}
            className="p-2 border rounded-lg"
          />
          <input
            type="text"
            placeholder="Your UPI ID (for others to pay you)"
            value={upi}
            onChange={(e) => setUpi(e.target.value)}
            className="p-2 border rounded-lg"
          />
          <button
            onClick={handleStartOrder}
            className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-bold hover:bg-yellow-500 transition-colors"
          >
            Start Order
          </button>
        </div>
      </div>
      
      {/* The "My Orders" section has been moved here */}
      <MyOrders
        orders={myOrders}
        handleLock={handleLock}
        handleDelete={handleDelete}
        currentUser={user}
      />

      {/* The modal's position in the JSX does not affect its appearance */}
      <JoinOrderModal
        isOpen={isJoinModalOpen}
        onClose={handleCloseJoinModal}
        onSubmit={handleJoinSubmit}
        order={selectedOrder}
      />
    </div>
  );
};

export default Dashboard;