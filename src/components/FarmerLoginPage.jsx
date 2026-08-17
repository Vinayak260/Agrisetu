import React from 'react';
import { useNavigate } from 'react-router-dom';
import FarmerLogin from './FarmerLogin';

function FarmerLoginPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-green-700 text-white p-4 text-center">
        <h1 className="text-2xl font-bold">Agrisetu</h1>
        <p className="text-sm">Bridges the gap between Farmers and technology</p>
      </header>

      {/* Login Form Container */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div
          className="w-full max-w-md bg-white rounded-2xl p-6
            border-2 border-green-200
            shadow-lg
            transition-all duration-300 ease-in-out
            hover:border-green-500 hover:shadow-2xl hover:shadow-green-100 hover:-translate-y-1"
        >
          <h2 className="text-xl font-semibold text-center mb-6 text-gray-800">Login to your Account</h2>
          {/* Renders the FarmerLogin form component */}
          <FarmerLogin />
          <p className="text-center text-sm text-gray-600 mt-4">
            Not registered yet?{' '}
            <button
              onClick={() => navigate('/farmer-signup')}
              className="text-blue-500 hover:text-blue-700 underline underline-offset-2 transition-colors font-medium"
            >
              sign up here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default FarmerLoginPage;
