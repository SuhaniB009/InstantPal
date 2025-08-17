import React, { useState } from 'react';
import { io } from 'socket.io-client';
import { api } from '../utils/api';

const socket = io(api.defaults.baseURL);

const JoinOrderModal = ({ order, isOpen, onClose, onSubmit, currentUser }) => {
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

    // Add item to order
    onSubmit({ name, quantity, link });

    // Emit message to chat (so all members see it in ChatBox)
    socket.emit('sendMessage', {
      orderId: order._id,
      sender: currentUser?.name || "Someone",
      message: `${currentUser?.name || "Someone"} added ${quantity} × ${name} ${link ? `(Link: ${link})` : ""} to the order.`,
    });

    // Reset and close
    setName('');
    setQuantity(1);
    setLink('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-yellow-50 bg-opacity-50 flex justify-center items-center z-50">
      {/* Modal Content */}
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
              onClick={onClose}
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

export default JoinOrderModal;