
import React from 'react';
import { useNavigate } from 'react-router-dom';

function UserSelectionPage() {
  const navigate = useNavigate();

  const handleUserSelect = (userType) => {
    if (userType === 'farmer') {
      navigate('/farmer-login');
    } else if (userType === 'admin') {
      navigate('/farmer-login');
    }
  };

  return (
    <div className="min-h-screen relative">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=1600')" }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/30"></div>
      <div className="relative flex items-center justify-center min-h-screen">
        <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg text-center space-y-6">
          <h1 className="text-3xl font-bold text-gray-800">Select User Type</h1>
          <div className="flex justify-around">
            <button
              onClick={() => handleUserSelect('farmer')}
              className="w-32 p-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Farmer
            </button>
            <button
              onClick={() => handleUserSelect('admin')}
              className="w-32 p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserSelectionPage;
