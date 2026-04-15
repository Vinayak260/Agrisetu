/*
import React, { useState, useEffect } from 'react';
import { getAgriAdvice } from '../../utils/agriWeatherLogic';
import WeatherCard from './WeatherCard';
import { MapPin, Loader2 } from 'lucide-react';

const WeatherBoard = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  useEffect(() => {
    // Get Farmer's Location
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=mr`;
          
          const response = await fetch(url);
          const data = await response.json();
          
          if (data.cod !== 200) throw new Error(data.message);
          
          setWeather(data);
          setLoading(false);
        } catch (err) {
          setError("हवामान माहिती मिळवण्यात अडचण येत आहे.");
          setLoading(false);
        }
      },
      () => {
        setError("कृपया लोकेशन परवानगी द्या (Please enable location).");
        setLoading(false);
      }
    );
  }, [API_KEY]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-10">
      <Loader2 className="animate-spin text-green-600 mb-2" size={40} />
      <p className="text-slate-500 italic">तुमच्या गावाचे हवामान शोधत आहे...</p>
    </div>
  );

  if (error) return <div className="p-5 text-red-500 text-center font-bold">{error}</div>;

  const advice = getAgriAdvice(weather);

  return (
    <div className="max-w-md mx-auto">
     
      <div className="flex items-center gap-2 mb-6 px-2">
        <div className="bg-green-100 p-2 rounded-lg text-green-700">
          <MapPin size={20} />
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-800 leading-none">{weather.name}</h2>
          <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">हवामान स्थिती</p>
        </div>
      </div>

      <WeatherCard weather={weather} advice={advice} />
    </div>
  );
};

export default WeatherBoard;
*/

import React, { useState, useEffect } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import WeatherHero from './WeatherHero';
import StatsGrid from './StatsGrid';
import SowingCalendar from './SowingCalendar';
import WeeklyForecast from './WeeklyForecast';

const WeatherBoard = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState('mr');

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude: lat, longitude: lon } = position.coords;
          
          // FIXED: Use two distinct endpoints
          const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=${language}`;
          const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=${language}`;

          // Fetching both datasets simultaneously
          const [currRes, foreRes] = await Promise.all([
            fetch(currentUrl),
            fetch(forecastUrl)
          ]);

          const current = await currRes.json();
          const forecast = await foreRes.json();

          if (current.cod !== 200) throw new Error(current.message);

          setWeatherData(current);

          // Handle the forecast data specifically
          if (forecast.cod === "200" || forecast.cod === 200) {
            setForecastData(forecast.list);
          }
          
          setLoading(false);
        } catch (err) {
          setError("हवामान माहिती मिळवण्यात अडचण येत आहे.");
          setLoading(false);
        }
      },
      () => {
        setError("कृपया लोकेशन परवानगी द्या (Please enable location).");
        setLoading(false);
      }
    );
  }, [API_KEY, language]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <Loader2 className="animate-spin text-indigo-600 mb-4" size={48} />
      <p className="text-sm font-black text-slate-400 uppercase tracking-widest">माहिती गोळा करत आहे...</p>
    </div>
  );

  if (error) return <div className="p-10 text-rose-500 text-center font-black">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-700">
      
      {/* 1. Purple Header */}
      <WeatherHero data={weatherData} currentLang={language} setLang={setLanguage} />

      {/* 2. Middle Grid (Stats and Advice) */}
      <div className="bg-white rounded-[3rem] p-8 md:p-12 border border-slate-100 shadow-2xl shadow-slate-200/40">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left Column (2/3): Metrics */}
          <div className="lg:col-span-2 space-y-10">
            <div className="flex items-center gap-8">
              <div className="p-6 bg-amber-50 rounded-[2.5rem] border border-amber-100 shadow-inner">
                <img 
                  src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`} 
                  alt="weather"
                  className="w-24 h-24 drop-shadow-2xl"
                />
              </div>
              <div>
                <div className="flex items-start">
                  <h2 className="text-7xl font-black text-slate-800 tracking-tighter">
                    {Math.round(weatherData.main.temp)}
                  </h2>
                  <span className="text-3xl font-black text-indigo-600 mt-2">°C</span>
                </div>
                <p className="text-lg font-bold text-slate-400 capitalize -mt-2">
                  {weatherData.weather[0].description} • Feels like {Math.round(weatherData.main.feels_like)}°C
                </p>
              </div>
            </div>

            <StatsGrid data={weatherData} />
          </div>

          {/* Right Column (1/3): Advice */}
          <div className="lg:col-span-1 lg:border-l lg:border-slate-100 lg:pl-10">
            <SowingCalendar weatherData={weatherData} />
          </div>
        </div>
      </div>

      {/* 3. Bottom Strip: Weekly Forecast */}
      <WeeklyForecast forecastList={forecastData} />
      
    </div>
  );
};

export default WeatherBoard;