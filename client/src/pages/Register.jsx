import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {api} from '../utils/api';
const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [hostel, setHostel] = useState("");
  const [roomNumber, setRoomNumber] = useState(""); 
  const [email, setEmail] = useState("");
  const [rollNumber, setRollNumber] = useState(""); 
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const name = `${firstName} ${lastName}`;

    // ✅ Client-side validation for room number
    if (!/^\d{4}$/.test(roomNumber)) {
      alert("Room number must be exactly 4 digits.");
      setLoading(false);
      return;
    }

    try {
      const res = await api.post("/auth/register", {
        name,
        email,
        password,
        hostel,
        roomNumber,
        rollNumber,
      });

      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        // ✅ redirect using navigate
        navigate("/dashboard");
      } else {
        alert("Registration successful, please login.");
        navigate("/login");
      }
    } catch (err) {
      alert(err.response?.data?.msg || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#151544] flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-semibold text-center text-gray-900">Sign up</h2>
        <br />

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="First Name*"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-1/2 px-4 py-2 border-b-2 focus:outline-none focus:border-blue-500 placeholder:text-sm"
              required
            />
            <input
              type="text"
              placeholder="Last Name*"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-1/2 px-4 py-2 border-b-2 focus:outline-none focus:border-blue-500 placeholder:text-sm"
              required
            />
          </div>

          <input
            type="text"
            placeholder="Roll Number*"
            value={rollNumber}
            onChange={(e) => setRollNumber(e.target.value)}
            className="w-full px-4 py-2 border-b-2 focus:outline-none focus:border-blue-500 placeholder:text-sm"
            required
          />

          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Hostel / Block*"
              value={hostel}
              onChange={(e) => setHostel(e.target.value)}
              className="w-1/2 px-4 py-2 border-b-2 focus:outline-none focus:border-blue-500 placeholder:text-sm"
              required
            />
            <input
              type="text"
              placeholder="Room No. (4 digits)*"
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
              maxLength={4}
              className="w-1/2 px-4 py-2 border-b-2 focus:outline-none focus:border-blue-500 placeholder:text-sm"
              required
            />
          </div>

          <input
            type="email"
            placeholder="Email*"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border-b-2 focus:outline-none focus:border-blue-500 placeholder:text-sm"
            required
          />

          <input
            type="password"
            placeholder="Password*"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border-b-2 focus:outline-none focus:border-blue-500 placeholder:text-sm"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-black py-2 rounded-md transition duration-300"
          >
            {loading ? "Signing up..." : "Create Account"}
          </button>



          <div className="text-center mt-2 text-sm">
            <a href="/login" className="text-blue-600 hover:underline">
              Already have an account?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;