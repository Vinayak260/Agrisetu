import React from 'react';
import AdminSignup from './AdminSignup';
import { useNavigate } from 'react-router-dom';

function AdminSignupPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.pexels.com/photos/1595104/pexels-photo-1595104.jpeg?auto=compress&cs=tinysrgb&w=1600')" }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/30"></div>
      <div className="relative max-w-md p-6 bg-white rounded-xl shadow-lg border-2 border-yellow-200 m-4">
        <AdminSignup />
        <p className="mt-4 text-sm text-gray-600 text-center">
          Already have an account?{" "}
          <button
            onClick={() => navigate('/admin-login')}
            className="text-blue-500 hover:text-blue-700 underline"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}

export default AdminSignupPage;