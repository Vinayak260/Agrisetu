

/*
import React, { useState, useEffect } from 'react';
import { getAgriAdvice } from '../utils/agriWeatherLogic';
import { CloudRain, Wind, Thermometer, Droplets, MapPin, Volume2 } from 'lucide-react';

const WeatherPage = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

  useEffect(() => {
    // 1. Get Location
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric&lang=mr`;
      
      const res = await fetch(url);
      const data = await res.json();
      setWeather(data);
      setLoading(false);
    });
  }, [apiKey]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-green-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
    </div>
  );

  const adviceMap = getAgriAdvice(weather); // Get our farming-specific logic

  return (
    <div className="min-h-screen bg-slate-50 p-4 pb-20 font-sans">

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <MapPin className="text-green-600" size={24} /> {weather.name}
          </h1>
          <p className="text-slate-500">आजचे हवामान (Today's Weather)</p>
        </div>
        <div className="bg-white p-2 rounded-full shadow-sm">
          <img 
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} 
            alt="weather icon"
            className="w-12 h-12"
          />
        </div>
      </div>

      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center">
          <Thermometer className="text-orange-500 mb-2" size={28} />
          <p className="text-sm text-slate-500">तापमान</p>
          <p className="text-3xl font-black text-slate-800">{Math.round(weather.main.temp)}°C</p>
        </div>
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center">
          <Wind className="text-blue-500 mb-2" size={28} />
          <p className="text-sm text-slate-500">वारा</p>
          <p className="text-3xl font-black text-slate-800">{Math.round(weather.wind.speed * 3.6)} <span className="text-sm">km/h</span></p>
        </div>
      </div>


      <div className="space-y-4 mb-8">
        <h2 className="text-lg font-bold text-slate-700">शेती सल्ला (Agri Advisory)</h2>
        
        {Object.keys(adviceMap).map((key) => {
          const item = adviceMap[key];
          const colors = {
            danger: "bg-red-50 border-red-500 text-red-800",
            warning: "bg-orange-50 border-orange-500 text-orange-800",
            success: "bg-green-50 border-green-500 text-green-800"
          };

          return (
            <div key={key} className={`p-4 rounded-2xl border-l-8 shadow-sm ${colors[item.status]}`}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs uppercase font-bold opacity-60 mb-1">{key}</p>
                  <p className="font-semibold text-lg leading-tight">{item.text}</p>
                </div>
             
                <button className="p-2 bg-white rounded-full shadow-sm hover:scale-110 transition-transform">
                  <Volume2 size={20} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

     
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex justify-around">
        <div className="text-center">
          <Droplets className="text-blue-400 mx-auto mb-1" size={20} />
          <p className="text-xs text-slate-400">आद्रता (Humidity)</p>
          <p className="font-bold">{weather.main.humidity}%</p>
        </div>
        <div className="w-px bg-slate-100"></div>
        <div className="text-center">
          <CloudRain className="text-indigo-400 mx-auto mb-1" size={20} />
          <p className="text-xs text-slate-400">पाऊस (Rain)</p>
          <p className="font-bold">{weather.rain ? weather.rain['1h'] : 0} mm</p>
        </div>
      </div>
    </div>
  );
};

export default WeatherPage;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAgriAdvice } from '../utils/agriWeatherLogic';

// --- VERIFIED IMPORTS ---
import StatsGrid from '../features/weather/StatsGrid';
import WeatherHero from '../features/weather/WeatherHero';
import WeeklyForecast from '../features/weather/WeeklyForecast';
import Navbar from '../components/Navbar'; 

import { Volume2, MapPin, Loader2, ChevronLeft, Wind, Droplets, Cloud } from 'lucide-react';

const WeatherPage = () => {
  const navigate = useNavigate();
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState('mr');

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      try {
        const currentRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=${lang}`);
        const currentData = await currentRes.json();

        const forecastRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
        const forecastData = await forecastRes.json();

        setWeather(currentData);
        setForecast(forecastData.list.filter((_, index) => index % 8 === 0));
        setLoading(false);
      } catch (error) {
        console.error("Fetch Error:", error);
        setLoading(false);
      }
    });
  }, [lang, API_KEY]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <Loader2 className="animate-spin text-green-600" size={40} />
    </div>
  );

  const adviceMap = getAgriAdvice(weather);

  return (
    // 'w-full' and 'max-w-none' ensures it doesn't stay small
    <div className="min-h-screen w-full bg-[#fcfdfd] pb-32 overflow-x-hidden">
      
     
      <div className="bg-white/80 backdrop-blur-md sticky top-0 z-50 p-4 border-b flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2 bg-slate-100 rounded-full">
          <ChevronLeft size={20} />
        </button>
        <div className="text-center">
          <p className="text-[10px] uppercase font-black text-slate-400">Current Location</p>
          <h1 className="font-black text-slate-800 flex items-center gap-1">
            <MapPin size={16} className="text-green-600" /> {weather.name}
          </h1>
        </div>
        <div className="w-10"></div>
      </div>

     
      <div className="p-4">
        <div className="bg-gradient-to-br from-green-700 to-green-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden mb-6">
            <div className="relative z-10 flex flex-col items-center">
                <img 
                    src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`} 
                    className="w-32 h-32 drop-shadow-xl" 
                />
                <h2 className="text-7xl font-black">{Math.round(weather.main.temp)}°</h2>
                <p className="text-xl font-bold opacity-80 capitalize">{weather.weather[0].description}</p>
            </div>
       
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
        </div>

      
        <WeatherHero currentLang={lang} setLang={setLang} />

     
        <div className="mt-8 space-y-4">
          <h3 className="text-xl font-black text-slate-800 px-2 italic">शेती सल्ला (Advisory)</h3>
          {Object.entries(adviceMap).map(([key, item]) => (
            <div key={key} className={`flex items-center gap-4 p-5 bg-white rounded-[2rem] shadow-sm border-l-[12px] ${
                item.status === 'danger' ? 'border-red-500' : item.status === 'warning' ? 'border-yellow-400' : 'border-green-500'
            }`}>
              <div className="flex-1">
                <p className="text-[10px] font-black text-slate-300 uppercase">{key}</p>
                <p className="font-bold text-slate-700 leading-tight">{item.text}</p>
              </div>
              <button className="p-3 bg-slate-50 rounded-full text-green-700">
                <Volume2 size={20} />
              </button>
            </div>
          ))}
        </div>

        
        <div className="mt-8">
            <h3 className="text-xl font-black text-slate-800 px-2 mb-4 italic">हवामान तपशील (Details)</h3>
            <StatsGrid data={weather} />
        </div>

    
        <div className="mt-8 mb-10">
            <WeeklyForecast forecastList={forecast} />
        </div>
      </div>

 
      <Navbar />
    </div>
  );
};

export default WeatherPage;
*/