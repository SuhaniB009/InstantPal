import React from 'react';
import { formatDistanceToNow, format } from 'date-fns';
import { 
  FaTrash, 
  FaLock, 
  FaUsers, 
  FaPlusCircle, 
  FaTruck, 
  FaUserCircle ,
  FaRegCreditCard
} from 'react-icons/fa';

const MyOrders = ({ orders, handleLock, handleDelete, currentUser, onAddItemsClick }) => {
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
        const isInitiator = order.initiatedBy?.email === currentUser?.email;
        const isLocked = order.status === 'Locked';

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
                  {isLocked ? (
                    <span className="text-blue-600 font-semibold flex items-center gap-2">
                      <FaTruck /> Order Placed
                    </span>
                  ) : (
                    <span className="text-green-600 font-semibold">✅ Open</span>
                  )}
                </p>
              </div>
               {/* ✅ STEP 2: Add the UPI ID display logic */}
                {/* This block only shows for participants of a locked order */}
                {isLocked && !isInitiator && order.upiId && (
                  <div className="mt-2 p-2 bg-green-100 border border-green-300 rounded-lg">
                    <p className="text-sm text-gray-800 flex items-center gap-2">
                      <FaRegCreditCard className="text-green-700" />
                      Pay initiator at:
                      <strong className="font-mono bg-white px-1 rounded">{order.upiId}</strong>
                    </p>
                  </div>
                )}
              
              {/* ✅ STEP 2: Update the time display logic */}
              <div className="text-right text-sm text-gray-500">
                {isLocked && order.lockedAt ? (
                  <span className="font-medium">
                    Placed on <br />
                    {format(new Date(order.lockedAt), 'dd MMM, h:mm a')}
                  </span>
                ) : (
                  formatDistanceToNow(new Date(order.createdAt)) + ' ago'
                )}
              </div>
            </div>

            {/* --- JOINED ITEMS LIST --- */}
            {order.items?.length > 0 && (!isLocked || (isLocked && !isInitiator)) && (
              <div className="mt-3 pt-3 border-t">
                 <strong className="text-gray-700">Joined Items ({order.items.length}):</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  {order.items.map((item, idx) => (
                    <li key={idx}>
                      <span className="font-medium">{item.user?.name || 'Someone'}:</span>
                      {item.link ? (
                        <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {` ${item.name}`}
                        </a>
                      ) : ( ` ${item.name}`)}
                      {` × ${item.quantity}`}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* --- PARTICIPANT TIMELINE VIEW --- */}
            {isInitiator && isLocked && order.items.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <h4 className="font-semibold text-gray-800 mb-3">Order Participants</h4>
                <div className="relative border-l-2 border-blue-200 pl-6 space-y-6">
                  {order.items.map((item, index) => (
                    <div key={index} className="relative">
                      <div className="absolute -left-[33px] top-1 h-4 w-4 bg-white border-2 border-blue-500 rounded-full"></div>
                      <div className="font-bold flex items-center gap-2 text-gray-700">
                        <FaUserCircle />
                        {item.user?.name || 'A User'}
                      </div>
                      <div className="pl-6 text-sm text-gray-600 mt-1">
                        <p>
                          <span className="font-medium">Item:</span> {item.name} (×{item.quantity})
                        </p>
                        {item.link && (
                          <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            View Product Link
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4 flex items-center gap-3">
              {isInitiator && !isLocked && (
                <button
                  onClick={() => handleLock(order._id)}
                  className="bg-blue-500 hover:bg-blue-600 text-black px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <FaLock /> Lock & Place Order
                </button>
              )}
              {isInitiator && (
                 <button
                  onClick={() => handleDelete(order._id)}
                  className="bg-red-500 hover:bg-red-600 text-black px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <FaTrash /> Delete
                </button>
              )}
              {!isInitiator && !isLocked && (
                <button
                  onClick={() => onAddItemsClick(order)}
                  className="bg-green-500 hover:bg-green-600 text-black font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <FaPlusCircle /> Add More Items
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MyOrders;