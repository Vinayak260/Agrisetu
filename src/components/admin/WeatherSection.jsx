import React, { useState, useEffect } from 'react';
import axios from 'axios';
// ... existing imports (icons, recharts)

const WeatherSection = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  useEffect(() => {
    // Function to fetch weather using coordinates
    const fetchWeatherByCoords = async (lat, lon) => {
      try {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
        const response = await axios.get(url);
        setWeatherData(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Weather fetch error:", err);
        setLoading(false);
      }
    };

    // 1. Get User Location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherByCoords(latitude, longitude);
        },
        (error) => {
          console.error("Location denied, falling back to Pune:", error);
          // Fallback: If user denies location, fetch for Pune by default
          fetchWeatherByCity("Pune");
        }
      );
    } else {
      console.error("Geolocation not supported by this browser.");
      fetchWeatherByCity("Pune");
    }
  }, [API_KEY]);

  // Fallback function if GPS fails
  const fetchWeatherByCity = async (cityName) => {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${API_KEY}`;
      const response = await axios.get(url);
      setWeatherData(response.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-10 text-center">Locating your farm...</div>;
  if (!weatherData) return <div className="p-10 text-center text-red-500">Failed to load weather.</div>;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-[2.5rem] p-8 text-white shadow-xl">
        <h2 className="text-4xl font-black mb-2">{Math.round(weatherData.main.temp)}°C</h2>
        {/* Now the city name is dynamic from the API result */}
        <p className="text-xl font-medium opacity-90">{weatherData.name}</p> 
        <p className="capitalize opacity-80">{weatherData.weather[0].description}</p>
      </div>
      {/* Rest of your UI cards... */}
    </div>
  );
};

export default WeatherSection;