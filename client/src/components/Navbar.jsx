import React,{ useState }  from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from "lucide-react"; 

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md py-4 px-6 flex justify-between items-center z-50">
      
      <Link to="/" className="flex items-center gap-2">
        <img 
          src="/instaPal Logo.png"  
          alt="Instapal Logo" 
          className="h-12 w-12" 
        />
        <span className="text-3xl font-bold text-blue-800">Instapal</span>
      </Link>
      

      <div className="hidden md:flex items-center space-x-4">
        <Link to="/" className="text-gray-700 hover:text-blue-600">Home</Link>
        <Link to="/login" className="text-gray-700 hover:text-blue-600">Login</Link>
        <Link to="/register" className="btn btn-primary px-4 py-1 text-sm">Get Started</Link>
      </div>

      <button
        className="md:hidden text-gray-700 hover:text-blue-600 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={26} /> : <Menu size={26} />}
      </button>

      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-white border-t border-gray-200 shadow-md flex flex-col items-center space-y-3 py-4 md:hidden z-50">
          <Link
            to="/"
            className="text-gray-700 hover:text-blue-600"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/login"
            className="text-gray-700 hover:text-blue-600"
            onClick={() => setIsOpen(false)}
          >
            Login
          </Link>
          <Link
            to="/register"
            className="btn btn-primary px-4 py-1 text-sm"
            onClick={() => setIsOpen(false)}
          >
            Get Started
          </Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;