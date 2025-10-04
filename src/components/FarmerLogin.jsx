// // //FarmerLogin.jsx
//  import { useState } from "react";
//  import { supabase } from "../lib/supabaseClient";

//  export default function FarmerLogin() {
//   const [phone, setPhone] = useState("");
//   const [message, setMessage] = useState("");

//   const handleLogin = async (e) => {
//      e.preventDefault();
//      const { error } = await supabase.auth.signInWithOtp({ phone });
//      if (error) setMessage(error.message);
//      else setMessage("OTP sent! Check your phone.");
//     };

//    return (
//     <div className="border border-yellow-300 bg-white p-6 rounded-xl shadow-lg">
//        <h2 className="text-xl font-bold text-center text-gray-800 mb-6">
//          Farmer Login
//        </h2>

//       <form onSubmit={handleLogin} className="space-y-5">
//        <div>
//            <label className="block text-gray-700 mb-1">Phone Number</label>
//            <input
//              type="tel"
//              className="w-full p-2 border rounded"
//              value={phone}
//              onChange={(e) => setPhone(e.target.value)}
//              placeholder="+91 9876543210"
//              required
//            />
//          </div>

//          {message && <p className="text-blue-500 text-sm">{message}</p>}

//          <button
//            type="submit"
//            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
//          >
//            Send OTP
//         </button>
//        </form>
//       </div>
//    );
// }

import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

function FarmerLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ 
      email: username, // Use username as email for login
      password 
    });
    if (error) {
      setError(error.message);
    } else {
      navigate('/dashboard'); // Redirect to dashboard or farmer-specific page
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div>
        <label className="block text-gray-700 mb-1">Username/Email</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username or email"
          required
        />
      </div>
      <div>
        <label className="block text-gray-700 mb-1">Password</label>
        <input
          type="password"
          className="w-full p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
      >
        Login
      </button>
      <p className="text-center text-sm text-gray-600">
        <button onClick={() => navigate('/farmer-forgot-password')} className="text-blue-500 hover:text-blue-700 underline">
          Forgot password?
        </button>
      </p>
    </form>
  );
}

export default FarmerLogin;