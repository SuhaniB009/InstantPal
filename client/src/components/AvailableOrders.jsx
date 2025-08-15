import React from 'react';
import { formatDistanceToNow } from 'date-fns';

const AvailableOrders = ({ orders, onJoinClick }) => {
  return (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <img src="pin-img copy.png" alt="Orders Icon" className="w-10 h-10" />
        <h2 className="text-xl font-semibold">Available Orders</h2>
      </div>

      {orders.length === 0 ? (
        <p className="text-gray-500">No other open orders in your hostel right now.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {orders.map((order) => (
            <div key={order._id} className="border-4 border-teal-600 rounded-xl p-0 bg-white shadow">
              <div className="rounded-lg p-4 bg-white-50 flex justify-between items-start relative">
                {/* Left content */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <img src="location-img copy.png" alt="Hostel" className="w-5 h-5" />
                    <h3 className="font-bold text-lg">{order.hostel}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <img src="platform-img copy.png" alt="Platform" className="w-5 h-5" />
                    <p><span className="font-medium">{order.platform}</span></p>
                  </div>
                  <div className="flex items-center gap-2">
                    <img src="initiator-img.png" alt="Initiator" className="w-4 h-4" />
                    <p><span className="text-sm">{order.initiatedBy?.name}</span></p>
                  </div>
                  <div className="flex items-center gap-2">
                    <img src="clock-img copy.png" alt="Time" className="w-4 h-4" />
                    <p>{formatDistanceToNow(new Date(order.createdAt))} ago</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <img src="open-img copy.png" alt="Status" className="w-4 h-4" />
                    <p>
                      <span className={order.isLocked ? 'text-red-600' : 'text-green-600'}>
                        {order.isLocked ? 'Locked' : 'Open'}
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <img src="order-img copy.png" alt="Items" className="w-4 h-4" />
                    <p>Items joined: {order.items.length}</p>
                  </div>
                  {!order.isLocked && (
                    <div className="mt-2">
                      <button
                        onClick={() => onJoinClick(order)}
                        className="bg-yellow-300 text-black px-4 py-2 rounded hover:bg-yellow-400 font-semibold"
                      >
                        🤝 Join
                      </button>
                    </div>
                  )}
                </div>

                {/* Right image */}
                <div className="hidden md:block">
                  <img src="high-five-img copy.png" alt="Order Illustration" className="w-60 h-60 object-contain ml-4" />
                </div>
                <div className="block md:hidden mt-4 text-center">
                  <img src="high-five-img copy.png" alt="Order Illustration" className="w-36 h-36 object-contain mx-auto" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AvailableOrders;