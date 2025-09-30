import React from 'react';
import AdminLogin from './AdminLogin';
import { useNavigate } from 'react-router-dom';

function AdminLoginPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.pexels.com/photos/1595104/pexels-photo-1595104.jpeg?auto=compress&cs=tinysrgb&w=1600')" }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/30"></div>
      <div className="relative max-w-md p-6 bg-white rounded-xl shadow-lg m-4">
        <AdminLogin />
        <p className="mt-4 text-sm text-gray-600 text-center">
          Don't have an account?{" "}
          <button
            onClick={() => navigate('/admin-signup')}
            className="text-blue-500 hover:text-blue-700 underline"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
}

export default AdminLoginPage;