import React, { useState } from 'react';
import axios from 'axios';

const InitiateOrderForm = () => {
  const [platform, setPlatform] = useState('Blinkit');
  const [products, setProducts] = useState('');
  const [upiId, setUpiId] = useState('');
  const [qrImage, setQrImage] = useState(null);
  const [qrPreview, setQrPreview] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleQrChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setQrImage(file);
      setQrPreview(URL.createObjectURL(file));
    }
  };

  const handleClearForm = () => {
    setPlatform('Blinkit');
    setProducts('');
    setUpiId('');
    setQrImage(null);
    setQrPreview(null);
    setMessage('');
    setSuccessMsg('');
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (!products.trim()) {
      setErrorMsg('❗ Please enter at least one product.');
      return;
    }
    if (!upiId.trim() && !qrImage) {
      setErrorMsg('❗ Please provide a UPI ID or upload a QR image.');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('platform', platform);
      formData.append('products', products);
      formData.append('upiId', upiId);
      formData.append('message', message);
      if (qrImage) formData.append('qrImage', qrImage);

      const response = await axios.post('/api/orders', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccessMsg('✅ Order initiated successfully!');
      handleClearForm();
    } catch (err) {
      const msg = err.response?.data?.message || '❌ Failed to initiate order. Please try again.';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 mt-8">
      <h2 className="text-2xl font-bold mb-4">📦 Initiate New Order</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div><label className="block text-sm font-semibold mb-1">Platform</label><select value={platform} onChange={(e) => setPlatform(e.target.value)} className="w-full border rounded-lg px-3 py-2"><option value="Blinkit">Blinkit</option><option value="InstaMart">InstaMart</option><option value="Swiggy">Swiggy</option><option value="Zomato">Zomato</option><option value="Annapurna">Annapurna Canteen</option></select></div>
        <div><label className="block text-sm font-semibold mb-1">Product Links or Names</label><textarea rows={3} value={products} onChange={(e) => setProducts(e.target.value)} placeholder="Paste product links or item names..." className="w-full border rounded-lg px-3 py-2" /></div>
        <div><label className="block text-sm font-semibold mb-1">Your UPI ID</label><input type="text" value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder="e.g., suhani@instapal" className="w-full border rounded-lg px-3 py-2" /></div>
        <div><label className="block text-sm font-semibold mb-1">Upload QR Code (optional)</label><input type="file" accept="image/*" onChange={handleQrChange} className="w-full" />{qrPreview && (<img src={qrPreview} alt="QR Preview" className="mt-3 w-32 h-32 object-contain border rounded-lg" />)}</div>
        <div><label className="block text-sm font-semibold mb-1">Message (optional)</label><input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Any special instructions?" className="w-full border rounded-lg px-3 py-2" /></div>
        <div className="flex gap-4"><button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg transition disabled:opacity-50">{loading ? 'Submitting...' : '🚀 Start Order'}</button><button type="button" onClick={handleClearForm} className="bg-gray-300 hover:bg-gray-400 text-black font-medium px-4 py-2 rounded-lg">🧹 Clear Form</button></div>
        {successMsg && <p className="text-green-600 mt-2">{successMsg}</p>}
        {errorMsg && <p className="text-red-600 mt-2">{errorMsg}</p>}
      </form>
    </div>
  );
};

export default InitiateOrderForm;