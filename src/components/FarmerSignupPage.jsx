

import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

function FarmerSignupPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!firstName.trim()) newErrors.firstName = 'First Name is required';
    if (!lastName.trim()) newErrors.lastName = 'Last Name is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    if (!username.trim()) newErrors.username = 'Username is required';
    else if (username.length < 6) newErrors.username = 'Username must be at least 6 characters';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) return;

    // DYNAMIC APPROACH: Passing metadata to trigger the public.profiles insertion
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { 
          full_name: `${firstName} ${lastName}`, // Used by the DB trigger
          firstName, 
          lastName, 
          username, 
          role: 'Farmer' // Categorizes user for the Admin Dashboard
        }
      }
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess('Signup successful! Please check your email to confirm. Once confirmed, you can log in to access farmer services.');
      // Navigate to login after a short delay
      setTimeout(() => navigate('/farmer-login'), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Brand Header */}
      <header className="bg-green-700 text-white p-6 shadow-lg text-center">
        <h1 className="text-3xl font-black tracking-tight italic">AgriSetu</h1>
        <p className="text-sm opacity-90 uppercase tracking-widest mt-1">Empowering Farmers with Technology</p>
      </header>

      {/* Signup Container */}
      <div className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-8 border-t-8 border-green-500">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Farmer Registration</h2>
            <p className="text-sm text-gray-500 mt-2">Join our community of digital farmers</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">First Name</label>
                <input
                  type="text"
                  className="w-full p-3 bg-gray-50 border border-gray-100 rounded-2xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Rahul"
                  required
                />
                {errors.firstName && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.firstName}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Last Name</label>
                <input
                  type="text"
                  className="w-full p-3 bg-gray-50 border border-gray-100 rounded-2xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Patil"
                  required
                />
                {errors.lastName && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.lastName}</p>}
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">E-Mail Address</label>
              <input
                type="email"
                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-2xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="farmer@email.com"
                required
              />
              {errors.email && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.email}</p>}
            </div>

            {/* Username Field */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Username</label>
              <input
                type="text"
                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-2xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="agri_rahul2026"
                required
              />
              {errors.username && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.username}</p>}
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Password</label>
                <input
                  type="password"
                  className="w-full p-3 bg-gray-50 border border-gray-100 rounded-2xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                {errors.password && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.password}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Confirm</label>
                <input
                  type="password"
                  className="w-full p-3 bg-gray-50 border border-gray-100 rounded-2xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                {errors.confirmPassword && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.confirmPassword}</p>}
              </div>
            </div>

            {/* Error/Success Messages */}
            {error && <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl text-center font-bold border border-red-100">{error}</div>}
            {success && <div className="p-3 bg-green-50 text-green-700 text-xs rounded-xl text-center font-bold border border-green-100">{success}</div>}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-green-200 hover:bg-green-700 hover:shadow-2xl transition-all transform active:scale-95"
            >
              Sign Up
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-400">
              Already have an account?{" "}
              <button 
                onClick={() => navigate('/farmer-login')} 
                className="text-green-600 font-bold hover:underline underline-offset-4"
              >
                Login here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FarmerSignupPage;
