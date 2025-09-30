import React from 'react';
import AdminSignup from './AdminSignup';
import { useNavigate } from 'react-router-dom';

function AdminSignupPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
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
  );
}

export default AdminSignupPage;