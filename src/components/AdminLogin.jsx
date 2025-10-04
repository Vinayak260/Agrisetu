/*
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
    } else {
      const { data: { user } } = await supabase.auth.getUser();
      const role = user?.user_metadata?.role || user?.app_metadata?.role;
      
      if (role === 'super-admin') {
        setError("Login successful! Welcome, Super Admin.");
        navigate('/dashboard');
      } else {
        setError("Access denied: Insufficient privileges.");
        await supabase.auth.signOut();
      }
    }
  };

  return (
    <div className="border border-yellow-300 bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold text-center text-gray-800 mb-6">Admin Login</h2>
      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label className="block text-gray-700 mb-1">Email</label>
          <input
            type="email"
            className="w-full p-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
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
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Login
        </button>
      </form>
    </div>
  );
} 
*/

    //  import React from 'react';

    //  function AdminLogin() {
    //    return (
    //      <div>
    //        <h2 className="text-2xl font-bold mb-4 text-center">Admin Login</h2>
    //        <input type="email" placeholder="Email" className="w-full p-2 mb-4 border rounded" />
    //        <input type="password" placeholder="Password" className="w-full p-2 mb-4 border rounded" />
    //        <button className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
    //          Login
    //        </button>
    //      </div>
    //    );
    //  }

    //  export default AdminLogin;

import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
    } else {
      const { data: { user } } = await supabase.auth.getUser();
      const role = user?.user_metadata?.role || user?.app_metadata?.role;
      
      if (role === 'super-admin') {
        navigate('/dashboard');
      } else {
        setError('Access denied: Insufficient privileges.');
        await supabase.auth.signOut();
      }
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div>
        <label className="block text-gray-700 mb-1">Username/Email</label>
        <input
          type="email"
          className="w-full p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
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
        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
      >
        Login
      </button>
      <p className="text-center text-sm text-gray-600">
        <button onClick={() => navigate('/forgot-password')} className="text-blue-500 hover:text-blue-700 underline">
          Forgot password?
        </button>
      </p>
    </form>
  );
}

export default AdminLogin;
     