import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import AvailableOrders from '../components/AvailableOrders';
import MyOrders from '../components/MyOrders';
import JoinOrderModal from '../components/JoinOrderModal';

import { api } from '../utils/api';

<JoinOrderModal/>


const Dashboard = () => {
  const [user, setUser] = useState(null);
  
  const [myOrders, setMyOrders] = useState([]);
  const [availableOrders, setAvailableOrders] = useState([]);

  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  
  const [platform, setPlatform] = useState('Blinkit');
  const [upiId, setUpiId] = useState('');
  const [optionalMessage, setOptionalMessage] = useState('');

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const config = useMemo(
    () => ({ headers: { Authorization: `Bearer ${token}` } }),
    [token]
  );

  
  const fetchData = async () => {
    try {
      const [userRes, myOrdersRes, availableOrdersRes] = await Promise.all([
        api.get('/api/auth/profile', config),
        api.get('/api/orders/myorders', config),   
        api.get('/api/orders/hostel', config)     
      ]);

      setUser(userRes.data);
      setMyOrders(myOrdersRes.data);
      
      const myOrderIds = new Set(myOrdersRes.data.map(order => order._id));
      const filteredAvailable = availableOrdersRes.data.filter(order => !myOrderIds.has(order._id));
      setAvailableOrders(filteredAvailable);

    } catch (err) {
      console.error('Dashboard fetch error:', err?.response?.data || err.message);
      if (err?.response?.status === 401) {
        localStorage.removeItem('token');
      }
      navigate('/login');
    }
  };

  useEffect(() => {
    if (token) {
      fetchData();
    } else {
      navigate('/login');
    }
  }, [token]);


  const handleStartOrder = async () => {
    try {
      await api.post('/api/orders/create', { platform, upiId, optionalMessage }, config);
      await fetchData(); 
      setUpiId('');
      setOptionalMessage('');
    } catch (err) {
      alert(err?.response?.data?.message || 'Error creating order');
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
    if (!selectedOrder?._id) return;
    try {
      await api.post(`/api/orders/join/${selectedOrder._id}`, formData, config);
      await fetchData();
      handleCloseJoinModal();
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to join order.');
    }
  };

  const handleLock = async (orderId) => {
    try {
      await api.post(`/api/orders/lock/${orderId}`, {}, config);
      await fetchData(); 
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to lock order.');
    }
  };

  const handleDelete = async (orderId) => {
    if (!window.confirm("Are you sure? This will permanently delete the order for everyone.")) return;
    try {
      await api.delete(`/api/orders/${orderId}`, config);
      await fetchData();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to delete order.");
    }
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

      <AvailableOrders orders={availableOrders} onJoinClick={handleOpenJoinModal} />

      <div className="bg-gray-100 p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">➕ Start a New Group Order</h2>
        <div className="grid gap-4">
          <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="p-2 border rounded-lg">
            <option>Blinkit</option>
            <option>InstaMart</option>
            <option>Swiggy</option>
            <option>Zomato</option>
            <option>Annapurna</option>
          </select>
          <input
            type="text"
            placeholder="Your UPI ID (for others to pay you)"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            className="p-2 border rounded-lg"
            required
          />
          <input
            type="text"
            placeholder="Optional Message (e.g., Ordering at 9 PM)"
            value={optionalMessage}
            onChange={(e) => setOptionalMessage(e.target.value)}
            className="p-2 border rounded-lg"
          />
          <button onClick={handleStartOrder} className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-bold hover:bg-yellow-500 transition-colors">
            Start Order
          </button>
        </div>
      </div>

      <MyOrders
        orders={myOrders}
        handleLock={handleLock}
        handleDelete={handleDelete}
        currentUser={user}
        onAddItemsClick={handleOpenJoinModal}
      />

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