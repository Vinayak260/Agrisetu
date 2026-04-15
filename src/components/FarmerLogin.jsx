

import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

function FarmerLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithPassword({ 
        email: username, // Assuming username is the email
        password 
      });

      if (error) {
        setError(error.message);
      } else {
        // ✅ SUCCESS: Redirect specifically to the Farmer Dashboard
        navigate('/farmer-dashboard');
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      {/* Username/Email Input */}
      <div>
        <label className="block text-gray-700 font-medium mb-1 text-sm">Username/Email</label>
        <input
          type="email"
          className="w-full p-2.5 border rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your email"
          required
        />
      </div>

      {/* Password Input */}
      <div>
        <label className="block text-gray-700 font-medium mb-1 text-sm">Password</label>
        <input
          type="password"
          className="w-full p-2.5 border rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-md text-xs animate-pulse">
          {error}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className={`w-full bg-green-600 text-white py-2.5 rounded-lg font-bold hover:bg-green-700 transition-colors shadow-md ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {loading ? 'Logging in...' : 'Login to Dashboard'}
      </button>

      {/* Forgot Password Link */}
      <p className="text-center text-sm text-gray-600">
        <button 
          type="button"
          onClick={() => navigate('/farmer-forgot-password')} 
          className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
        >
          Forgot password?
        </button>
      </p>
    </form>
  );
}

export default FarmerLogin;
