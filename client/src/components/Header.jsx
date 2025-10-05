import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import {api} from "../utils/api";


const Header = () => {
  const [user, setUser] = useState({ name: '', hostel: '',roomNumber: '' })
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/auth/profile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        setUser(res.data)
      } catch (err) {
        console.error('❌ Error fetching profile:', err)
        navigate('/login')
      }
    }

    fetchProfile()
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <header className="bg-pink-100 shadow-md px-4 py-2 flex items-center justify-between">
      {/* Left: Welcome Text + Avatar */}
      <div className="flex items-center gap-3">
        <img
          src="user-img copy.png"
          alt="User Avatar"
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold text-gray-800">Welcome, {user.name}</h2>
          <span className="text-xs text-gray-500">Hostel {user.hostel}, Room {user.roomNumber}</span>
        </div>
      </div>

      {/* Right: Desktop menu */}
      <div className="hidden md:flex items-center gap-4">
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-black px-4 py-1.5 text-sm rounded-lg transition-all"
        >
          Logout
        </button>
      </div>

      {/* Right: Mobile Hamburger */}
      <div className="md:hidden relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="focus:outline-none"
        >
          <svg
            className="w-6 h-6 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Dropdown */}
        {menuOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-md z-10 py-2">
            <p className="px-4 py-2 text-sm text-gray-700 font-medium">
              {user.name}
            </p>
            <p className="px-4 py-1 text-xs text-gray-500">{user.hostel}</p>
            <hr className="my-1" />
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header