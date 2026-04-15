import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';

function AdminUpdatePasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  // Parse both query params (?) and hash params (#)
  const urlParams = new URLSearchParams(location.search); // Query params
  const hashParams = new URLSearchParams(location.hash.substring(1)); // Hash params
  const token = urlParams.get('token') || hashParams.get('access_token') || hashParams.get('token');

  useEffect(() => {
    console.log('Token from URL:', token); // Debug: Check F12 > Console
    if (!token) {
      setError('Invalid or missing token. Please request a new reset link from admin login.');
    }
  }, [token]);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setSuccess('Password updated successfully! Redirecting to admin login...');
      setTimeout(() => navigate('/admin-login'), 2000);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Updating password...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-green-700 text-white p-4 text-center">
        <h1 className="text-2xl font-bold">Agrisetu</h1>
        <p className="text-sm">Bridges the gap between Farmers and technology</p>
      </header>

      {/* Update Password Form */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 border-2 border-blue-300">
          <h2 className="text-xl font-semibold text-center mb-6">Update Your Password</h2>
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                className="w-full p-2 border rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password (6+ characters)"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Confirm New Password</label>
              <input
                type="password"
                className="w-full p-2 border rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            {success && <p className="text-green-500 text-sm text-center">{success}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-600 mt-4">
            <button onClick={() => navigate('/admin-login')} className="text-blue-500 hover:text-blue-700 underline">
              Back to Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminUpdatePasswordPage;