

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
        {/* Added green border and shadow for visual framing */}
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 border-2 border-green-300">
          <h2 className="text-xl font-semibold text-center mb-6">Login to your Account</h2>
          {/* Renders the FarmerLogin form component */}
          <FarmerLogin />
          <p className="text-center text-sm text-gray-600 mt-4">
            Not registered yet? <button onClick={() => navigate('/farmer-signup')} className="text-blue-500 hover:text-blue-700 underline">sign up here</button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default FarmerLoginPage;
