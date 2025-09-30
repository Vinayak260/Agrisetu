import React from 'react';
function FeatureCrop() {
  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Real-Time Crop Updates & Soil Insights</h1>
      <p className="text-gray-600">
        Discover how our real-time crop updates and soil insights make farming easier with AI-powered alerts and recommendations.
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

export default FeatureCrop;