/*
import React from 'react';
import FarmerLogin from './FarmerLogin';
import { useNavigate } from 'react-router-dom';

function FarmerLoginPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.pexels.com/photos/1595104/pexels-photo-1595104.jpeg?auto=compress&cs=tinysrgb&w=1600')" }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/30"></div>
      <div className="relative max-w-md p-6 bg-white rounded-xl shadow-lg m-4">
        <FarmerLogin />
        <p className="mt-4 text-sm text-gray-600 text-center">
          Don't have an account?{" "}
          <button
            onClick={() => navigate('/farmer-signup')}
            className="text-blue-500 hover:text-blue-700 underline"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
}

export default FarmerLoginPage;
*/

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

      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-center mb-6">Login to your Account</h2>
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