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

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { firstName, lastName, username, role: 'farmer' }
      }
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess('Signup successful! Please check your email to confirm.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-green-700 text-white p-4 text-center">
        <h1 className="text-2xl font-bold">Agrisetu</h1>
        <p className="text-sm">Bridges the gap between Farmers and technology</p>
      </header>

      {/* Signup Form */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 border-2 border-green-300">
          <h2 className="text-xl font-semibold text-center mb-6">Register for Membership</h2>
          <p className="text-sm text-gray-600 text-center mb-6">If you are an existing member of AgriSetu, please log in to continue.</p>
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-gray-700 mb-1">* First Name</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded focus:border-green-500"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First Name"
                  required
                />
                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded focus:border-green-500"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last Name"
                  required
                />
                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
              </div>
            </div>
            <div>
              <label className="block text-gray-700 mb-1">* Your E-Mail Address</label>
              <input
                type="email"
                className="w-full p-2 border rounded focus:border-green-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your E-Mail Address"
                required
              />
              <p className="text-sm text-gray-500 mt-1">A confirmation email will be sent to you at this address.</p>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-gray-700 mb-1">* Choose a Username</label>
              <input
                type="text"
                className="w-full p-2 border rounded focus:border-green-500"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username (6+ characters)"
                required
              />
              <p className="text-sm text-gray-500 mt-1">It must be 6 or more characters in length and may only contain letters, numbers, and underscores.</p>
              {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
            </div>
            <div>
              <label className="block text-gray-700 mb-1">* Choose a Password</label>
              <input
                type="password"
                className="w-full p-2 border rounded focus:border-green-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password (6+ characters)"
                required
              />
              <p className="text-sm text-gray-500 mt-1">Must be 6 or more characters.</p>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>
            <div>
              <label className="block text-gray-700 mb-1">* Confirm Your Password</label>
              <input
                type="password"
                className="w-full p-2 border rounded focus:border-green-500"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                required
              />
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            {success && <p className="text-green-500 text-sm text-center">{success}</p>}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Sign Up
            </button>
          </form>
          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account? <button onClick={() => navigate('/farmer-login')} className="text-blue-500 hover:text-blue-700 underline">Login</button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default FarmerSignupPage;