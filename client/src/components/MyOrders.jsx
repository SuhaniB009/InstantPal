import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { FaTrash, FaLock, FaUsers } from 'react-icons/fa';

const MyOrders = ({ orders, handleLock, handleDelete, currentUser }) => {
  if (!orders || orders.length === 0) {
    return (
      <div className="bg-gray-100 p-4 rounded-xl text-center">
        <p className="text-gray-600">You haven't initiated or joined any orders yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <FaUsers className="text-2xl text-blue-600" />
        <h2 className="text-xl font-semibold">My Orders</h2>
      </div>

      {orders.map((order) => {
        // UPDATED: Check for initiator status using email for consistency
        const isInitiator = order.initiatedBy?.email === currentUser?.email;

        return (
          <div key={order._id} className="border p-4 rounded-xl shadow-md bg-white">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-lg">{order.platform}</p>
                <p className="text-sm text-gray-500">
                  Initiated by: {isInitiator ? 'You' : order.initiatedBy?.name}
                </p>
                <p>
                  <strong>Status:</strong>{' '}
                  {order.isLocked ? (
                    <span className="text-red-600 font-semibold">🔐 Locked</span>
                  ) : (
                    <span className="text-green-600 font-semibold"> Open</span>
                  )}
                </p>
              </div>
              <div className="text-right text-sm text-gray-500">
                {formatDistanceToNow(new Date(order.createdAt))} ago
              </div>
            </div>

            {order.items?.length > 0 && (
              <div className="mt-3 pt-3 border-t">
                <strong className="text-gray-700">Joined Items ({order.items.length}):</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  {order.items.map((item, idx) => (
                    <li key={idx}>
                      <span className="font-medium">{item.user?.name || 'Someone'}:</span>
                      
                      {/* --- UPDATED: Item name is now a clickable link if a link exists --- */}
                      {item.link ? (
                        <a 
                          href={item.link} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-blue-600 hover:underline"
                        >
                          {` ${item.name}`}
                        </a>
                      ) : (
                        ` ${item.name}`
                      )}
                      
                      {` × ${item.quantity}`}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Action Buttons for Initiator */}
            {isInitiator && !order.isLocked && (
              <div className="mt-4 flex items-center gap-3">
                <button
                  onClick={() => handleLock(order._id)}
                  className="bg-blue-500 hover:bg-blue-600 text-black px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <FaLock /> Lock Order
                </button>
                <button
                  onClick={() => handleDelete(order._id)}
                  className="bg-red-500 hover:bg-red-600 text-black px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <FaTrash /> Delete
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MyOrders;