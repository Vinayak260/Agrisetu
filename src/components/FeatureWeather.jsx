import React from 'react';

function FeatureWeather() {
  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Real-Time Weather Updates & Alerts</h1>
      <p className="text-gray-600">
        Explore our AI-driven real-time weather updates and alerts, designed to provide timely and actionable data 
        to support your farming decisions.
      </p>
      <button
        onClick={() => window.history.back()}
        className="mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
      >
        Back
      </button>
    </div>
  );
}

export default FeatureWeather;