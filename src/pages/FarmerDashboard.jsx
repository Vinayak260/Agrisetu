import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { ArrowLeft } from 'lucide-react';

// Feature Components
import WeatherHero from '../features/weather/WeatherHero';
import AIAssistant from '../features/ai-assistant/AIAssistant';
import KrushiDoctor from '../features/krushi-doctor/KrushiDoctor';
import StatsGrid from '../features/weather/StatsGrid';
import SowingCalendar from '../features/weather/SowingCalendar';
import WeeklyForecast from '../features/weather/WeeklyForecast';
import FarmerQuestionnaire from '../features/weather/FarmerQuestionnaire';
import { fetchOpenMeteo } from '../utils/openMeteoAdapter';

const PROFILE_STORAGE_KEY = 'agrisetu_farmer_profile';

const FarmerDashboard = () => {
  const [activeTab, setActiveTab] = useState('hub');
  const [language, setLanguage] = useState('mr');

  // ── Weather state ──────────────────────────────────────────────────────────
  const [weatherData, setWeatherData]       = useState(null);
  const [forecastData, setForecastData]     = useState(null);
  const [isFetchingWeather, setIsFetching]  = useState(false);
  const [weatherError, setWeatherError]     = useState(null);
  const [weatherSource, setWeatherSource]   = useState(null); // 'owm' | 'open-meteo'

  // ── GPS / Location state ───────────────────────────────────────────────────
  const [gpsCoords, setGpsCoords]           = useState(null);   // { lat, lon, accuracy }
  const [gpsLocation, setGpsLocation]       = useState(null);   // Nominatim result
  const [gpsLocating, setGpsLocating]       = useState(false);  // spinner for geocoding

  // ── Farmer Profile (persisted to localStorage) ────────────────────────────
  const [farmerProfile, setFarmerProfile] = useState(() => {
    try {
      const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);

  const navigate = useNavigate();

  // ── Logout ─────────────────────────────────────────────────────────────────
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/');
    } catch (err) {
      console.error('Logout Error:', err.message);
    }
  };

  // ── Reverse Geocode using OpenStreetMap Nominatim (free, no key needed) ───
  const reverseGeocode = useCallback(async (lat, lon) => {
    try {
      setGpsLocating(true);
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`,
        { headers: { 'Accept-Language': 'en', 'User-Agent': 'AgriSetuApp/1.0' } }
      );
      const data = await res.json();
      const addr = data.address || {};

      // Build a meaningful location label from available address parts
      const parts = [
        addr.village || addr.town || addr.suburb || addr.neighbourhood || addr.hamlet,
        addr.county || addr.district || addr.city_district,
        addr.state_district || addr.state,
      ].filter(Boolean);

      setGpsLocation({
        display: parts.join(', ') || data.display_name || 'Unknown',
        village: addr.village || addr.town || addr.suburb || '',
        district: addr.county || addr.district || '',
        state: addr.state || '',
        country: addr.country || '',
        postcode: addr.postcode || '',
        full: data.display_name || '',
      });
    } catch (err) {
      console.warn('Nominatim reverse geocode failed:', err);
    } finally {
      setGpsLocating(false);
    }
  }, []);

  // ── Fetch Weather via GPS + OpenWeatherMap ─────────────────────────────────
  const fetchWeatherByGeoloc = useCallback(() => {
    setIsFetching(true);
    setWeatherError(null);

    if (!navigator.geolocation) {
      setWeatherError('Geolocation is not supported by your browser.');
      setIsFetching(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lon, accuracy } = pos.coords;

        // Store coords
        setGpsCoords({ lat, lon, accuracy: Math.round(accuracy) });

        // Run reverse geocoding in parallel (non-blocking)
        reverseGeocode(lat, lon);

        const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
        if (!API_KEY || API_KEY === 'your_openweathermap_api_key_here') {
          setWeatherError('OpenWeatherMap API key not set. Add VITE_WEATHER_API_KEY to .env.local');
          setIsFetching(false);
          return;
        }

        try {
          // Fetch current weather + 5-day forecast in parallel
          const [weatherRes, forecastRes] = await Promise.all([
            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`),
            fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`),
          ]);

          // 401 = key not yet activated → silently fallback to Open-Meteo
          if (weatherRes.status === 401) {
            console.info('OWM key not active yet — switching to Open-Meteo fallback');
            const locName = gpsLocation?.village || gpsLocation?.display || 'Your Location';
            const { currentData, forecastList } = await fetchOpenMeteo(lat, lon, locName);
            setWeatherData(currentData);
            setForecastData(forecastList);
            setWeatherSource('open-meteo');
            setIsFetching(false);
            return;
          }

          if (!weatherRes.ok) throw new Error(`Weather API: ${weatherRes.status}`);

          const [currentData, forecastJson] = await Promise.all([
            weatherRes.json(),
            forecastRes.ok ? forecastRes.json() : Promise.resolve(null),
          ]);

          setWeatherData(currentData);
          if (forecastJson?.list) setForecastData(forecastJson.list);
          setWeatherSource('owm');
        } catch (err) {
          console.error('Weather Fetch Error:', err);
          // Last resort: try Open-Meteo directly
          try {
            const locName = gpsLocation?.village || gpsLocation?.display || 'Your Location';
            const { currentData, forecastList } = await fetchOpenMeteo(lat, lon, locName);
            setWeatherData(currentData);
            setForecastData(forecastList);
            setWeatherSource('open-meteo');
          } catch (fallbackErr) {
            console.error('Open-Meteo fallback also failed:', fallbackErr);
            setWeatherError('Could not fetch weather from any source. Check your internet connection.');
          }
        } finally {
          setIsFetching(false);
        }
      },
      (geoErr) => {
        console.error('Geolocation Error:', geoErr);
        const msgs = {
          1: 'Location access denied. Please allow permission in your browser.',
          2: 'Location unavailable. Try again in a moment.',
          3: 'Location request timed out. Please retry.',
        };
        setWeatherError(msgs[geoErr.code] || 'Could not get your location.');
        setIsFetching(false);
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
  }, [reverseGeocode]);

  // Auto-fetch on mount
  useEffect(() => { fetchWeatherByGeoloc(); }, [fetchWeatherByGeoloc]);

  // Auto-show questionnaire on first Weather Stats open
  useEffect(() => {
    if (activeTab === 'stats' && !farmerProfile) setShowQuestionnaire(true);
  }, [activeTab, farmerProfile]);

  // ── Farmer Profile Handlers ────────────────────────────────────────────────
  const handleProfileComplete = (profile) => {
    setFarmerProfile(profile);
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    setShowQuestionnaire(false);
  };

  // ── Translations ───────────────────────────────────────────────────────────
  const t = {
    en: { welcome: 'AGRISETU', logout: 'Logout', back: 'Back to Dashboard', weatherTitle: 'Weather Details' },
    hi: { welcome: 'एग्रीसेतु', logout: 'लॉग आउट', back: 'डैशबोर्ड पर वापस', weatherTitle: 'मौसम का विवरण' },
    mr: { welcome: 'अग्रिसेतू', logout: 'लॉग आउट', back: 'डॅशबोर्डवर परत जा', weatherTitle: 'हवामान तपशील' },
  }[language];

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-10">

      {/* Questionnaire Modal */}
      {showQuestionnaire && (
        <FarmerQuestionnaire
          onComplete={handleProfileComplete}
          onSkip={() => setShowQuestionnaire(false)}
        />
      )}

      {/* Navbar */}
      <nav className="px-8 py-6 flex justify-between items-center max-w-7xl mx-auto sticky top-0 bg-[#FDFDFD]/80 backdrop-blur-md z-40 border-b border-slate-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#1B4332] rounded-xl flex items-center justify-center shadow-lg text-white font-black">A</div>
          <span className="text-2xl font-black tracking-tighter text-[#1B4332]">{t.welcome}</span>
        </div>
        
        <div className="flex items-center gap-4">
          {activeTab !== 'hub' && (
            <div className="hidden lg:flex bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm gap-1">
              <button
                onClick={() => setActiveTab('doctor')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all whitespace-nowrap ${
                  activeTab === 'doctor' 
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200' 
                    : 'text-slate-500 hover:bg-emerald-50 hover:text-emerald-700'
                }`}
              >
                <span className="text-base">🏥</span> Krushi Doctor
              </button>
              <button
                onClick={() => setActiveTab('ai')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all whitespace-nowrap ${
                  activeTab === 'ai' 
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' 
                    : 'text-slate-500 hover:bg-indigo-50 hover:text-indigo-700'
                }`}
              >
                <span className="text-base">🤖</span> AI Assistant
              </button>
              <button
                onClick={() => setActiveTab('stats')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all whitespace-nowrap ${
                  activeTab === 'stats' 
                    ? 'bg-blue-500 text-white shadow-md shadow-blue-200' 
                    : 'text-slate-500 hover:bg-blue-50 hover:text-blue-700'
                }`}
              >
                <span className="text-base">📊</span> Weather Stats
              </button>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="bg-red-50 text-red-600 px-6 py-2 rounded-full font-bold text-sm hover:bg-red-100 transition-colors shrink-0"
          >
            {t.logout}
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 mt-4">
        {activeTab === 'hub' ? (
          /* ── Main Hub ── */
          <div className="space-y-12 animate-in fade-in duration-500">
            <div className="py-10 text-center">
              <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-2">नमस्कार, शेतकरी मित्र! 👋</h1>
              <p className="text-slate-500 font-medium tracking-wide">तुमच्या प्रगतीचा सोबती - एग्रीसेतू</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-2">
              <FeatureCard 
                icon="🏥" title="Krushi Doctor" desc="पीक रोग तपासणी" 
                color="bg-emerald-500" hoverBg="hover:bg-emerald-50 hover:border-emerald-200" activeBg="active:bg-emerald-100"
                onClick={() => setActiveTab('doctor')} 
              />
              <FeatureCard 
                icon="🤖" title="AI Assistant"  desc="व्हॉइस असिस्टंट" 
                color="bg-indigo-600" hoverBg="hover:bg-indigo-50 hover:border-indigo-200" activeBg="active:bg-indigo-100"
                onClick={() => setActiveTab('ai')}     
              />
              <FeatureCard 
                icon="📊" title="Weather Stats" desc="हवामान आणि सल्ला" 
                color="bg-blue-500" hoverBg="hover:bg-blue-50 hover:border-blue-200" activeBg="active:bg-blue-100"
                onClick={() => setActiveTab('stats')}  
              />
            </div>
          </div>
        ) : (
          /* ── Feature Content ── */
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            {/* ── Mobile Feature Tabs & Back Button ── */}
            <div className="flex flex-wrap items-center gap-3 mb-8 px-2 justify-between">
              <button
                onClick={() => setActiveTab('hub')}
                className="flex items-center gap-2 text-[#1B4332] font-black hover:bg-gray-100 px-4 py-2.5 rounded-2xl transition-all"
              >
                <ArrowLeft size={18} />
                <span className="uppercase tracking-widest text-[10px] font-bold">{t.back}</span>
              </button>

              {/* Show tabs here only on mobile since they are hidden in navbar on small screens */}
              <div className="flex lg:hidden bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm gap-1 overflow-x-auto hide-scrollbar w-full sm:w-auto mt-2 sm:mt-0">
                <button
                  onClick={() => setActiveTab('doctor')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all whitespace-nowrap ${
                    activeTab === 'doctor' 
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200' 
                      : 'text-slate-500 hover:bg-emerald-50 hover:text-emerald-700'
                  }`}
                >
                  <span className="text-base">🏥</span> Krushi Doctor
                </button>
                <button
                  onClick={() => setActiveTab('ai')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all whitespace-nowrap ${
                    activeTab === 'ai' 
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' 
                      : 'text-slate-500 hover:bg-indigo-50 hover:text-indigo-700'
                  }`}
                >
                  <span className="text-base">🤖</span> AI Assistant
                </button>
                <button
                  onClick={() => setActiveTab('stats')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all whitespace-nowrap ${
                    activeTab === 'stats' 
                      ? 'bg-blue-500 text-white shadow-md shadow-blue-200' 
                      : 'text-slate-500 hover:bg-blue-50 hover:text-blue-700'
                  }`}
                >
                  <span className="text-base">📊</span> Weather Stats
                </button>
              </div>
            </div>

            <div className="overflow-hidden bg-white rounded-[3.5rem] shadow-xl shadow-slate-200/50 border-2 border-slate-200 min-h-[600px] mb-10 transition-colors duration-500">

              {/* ── Weather Stats ── */}
              {activeTab === 'stats' && (
                <div className="animate-in fade-in duration-700">
                  <WeatherHero
                    currentLang={language}
                    setLang={setLanguage}
                    data={weatherData}
                    isFetching={isFetchingWeather}
                    gpsCoords={gpsCoords}
                    gpsLocation={gpsLocation}
                    gpsLocating={gpsLocating}
                    onUseCurrentLocation={fetchWeatherByGeoloc}
                    onRefresh={fetchWeatherByGeoloc}
                  />

                  {/* ── Source / Error notice ── */}
                  {weatherSource === 'open-meteo' && !weatherError && (
                    <div className="mx-4 md:mx-6 mt-3 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 animate-in fade-in duration-500">
                      <span className="text-[10px]">🌐</span>
                      <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">
                        Live data via Open-Meteo · OWM key activating (up to 2h)
                      </p>
                    </div>
                  )}
                  {weatherError && weatherError !== '__401__' && (
                    <div className="mx-4 md:mx-6 mt-4 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs font-bold text-amber-700 flex items-center gap-2">
                      <span>⚠️</span>
                      <span>{weatherError}</span>
                      <button onClick={fetchWeatherByGeoloc} className="ml-auto text-amber-900 underline">Retry</button>
                    </div>
                  )}

                  <div className="p-6 md:p-12 space-y-10">
                    {/* AI Recommendations + Crop Sowing */}
                    <section>
                      <SowingCalendar
                        weatherData={weatherData}
                        language={language}
                        farmerProfile={farmerProfile}
                        onSetupProfile={() => setShowQuestionnaire(true)}
                      />
                    </section>

                    {/* 5-Day Forecast */}
                    {forecastData && (
                      <section>
                        <WeeklyForecast forecastList={forecastData} />
                      </section>
                    )}

                    {/* Live Weather Stats */}
                    <section>
                      <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2 px-2">
                        <span className="w-1.5 h-6 bg-blue-500 rounded-full" />
                        {t.weatherTitle}
                      </h3>
                      <StatsGrid data={weatherData} />
                    </section>
                  </div>
                </div>
              )}

              {activeTab === 'ai' && (
                <div className="p-8 md:p-12">
                  <AIAssistant language={language} setLanguage={setLanguage} />
                </div>
              )}

              {activeTab === 'doctor' && (
                <div className="p-8 md:p-12">
                  <KrushiDoctor language={language} />
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc, color, hoverBg, activeBg, onClick }) => (
  <button
    onClick={onClick}
    className={`group bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 active:scale-95 transition-all duration-300 text-left w-full ${hoverBg || ''} ${activeBg || ''}`}
  >
    <div className={`${color} w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6 text-white shadow-lg group-hover:rotate-6 group-hover:scale-110 transition-all duration-300`}>
      {icon}
    </div>
    <h3 className="text-2xl font-black text-gray-900 tracking-tighter group-hover:text-[#1B4332] transition-colors duration-300">{title}</h3>
    <p className="text-slate-400 font-bold text-sm mt-1">{desc}</p>
    <p className="text-[#1B4332] mt-6 text-xs font-black uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all duration-300">
      Open Tab <span>→</span>
    </p>
  </button>
);

export default FarmerDashboard;