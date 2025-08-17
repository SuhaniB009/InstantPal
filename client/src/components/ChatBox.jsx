import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { api } from '../utils/api';

const ChatBox = ({ orderId, currentUser, onNewMessage }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null); // ✅ store socket in ref

  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // ✅ Setup socket + load chat history
  useEffect(() => {
    // create socket
    const socket = io(api.defaults.baseURL);
    socketRef.current = socket;

    const fetchChatHistory = async () => {
      try {
        const res = await api.get(`/api/orders/${orderId}`, config);
        setMessages(res.data.chat || []);
      } catch (error) {
        console.error('Failed to fetch chat history:', error);
      }
    };

    fetchChatHistory();

    // join order room
    socket.emit('join_order_room', orderId);

    const handleReceive = (incomingMessage) => {
      setMessages((prev) => [...prev, incomingMessage]);
      if (onNewMessage) onNewMessage();
    };

    socket.on('receive_message', handleReceive);

    // cleanup on unmount
    return () => {
      socket.emit('leave_order_room', orderId);
      socket.off('receive_message', handleReceive);
      socket.disconnect(); // ✅ disconnect properly
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  useEffect(scrollToBottom, [messages]);

  // ✅ Send message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    const trimmed = newMessage.trim();
    if (!trimmed) return;

    try {
      // Save to DB
      const res = await api.post(
        `/api/orders/${orderId}/chat`,
        { text: trimmed },
        config
      );

      const savedMessage = res.data;

      // Update local state
      setMessages((prev) => [...prev, savedMessage]);

      // Broadcast via socket
      if (socketRef.current) {
        socketRef.current.emit('send_message', {
          orderId,
          ...savedMessage,
        });
      }

      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div className="mt-4 border-t pt-4">
      <h4 className="font-semibold text-gray-800 mb-2">Order Chat</h4>

      <div className="h-64 overflow-y-auto bg-gray-50 p-3 rounded-lg border flex flex-col gap-3">
        {messages.map((msg, index) => {
          const senderId = msg?.user?._id || msg?.user;
          const isMe = String(senderId) === String(currentUser._id);
          const senderName = msg?.user?.name || msg?.name || 'User';

          return (
            <div
              key={msg._id || index}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-xs p-3 rounded-xl ${
                  isMe ? 'bg-pink-100 text-black' : 'bg-blue-100 text-black-800'
                }`}
              >
                <p className="text-xs font-bold mb-1">{senderName}</p>
                <p>{msg.text}</p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="mt-3 flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-grow border rounded-lg px-3 py-2"
        />
        <button
          type="submit"
          className="bg-blue-500 text-black font-semibold px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatBox;