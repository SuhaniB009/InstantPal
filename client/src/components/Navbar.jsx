import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-white shadow shadow-black py-4 px-6 flex justify-between items-center">
      
      <Link to="/" className="flex items-center gap-2">
        <img 
          src="/cart-img copy.png"  
          alt="Instapal Logo" 
          className="h-8 w-auto" 
        />
        <span className="text-3xl font-bold text-blue-800">Instapal</span>
      </Link>
      
      <div className="space-x-4">
        <Link to="/" className="text-gray-700 hover:text-blue-600">Home</Link>
        <Link to="/login" className="text-gray-700 hover:text-blue-600">Login</Link>
        <Link to="/register" className="btn btn-primary px-4 py-1 text-sm">Get Started</Link>
      </div>
    </nav>
  );
}

export default Navbar;