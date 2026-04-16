
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { ArrowLeft } from 'lucide-react';

// Feature Components
import WeatherHero from '../features/weather/WeatherHero';
import AIAssistant from '../features/ai-assistant/AIAssistant';
import KrushiDoctor from '../features/krushi-doctor/KrushiDoctor';
import StatsGrid from '../features/weather/StatsGrid';
import SowingCalendar from '../features/weather/SowingCalendar';

const FarmerDashboard = () => {
  const [activeTab, setActiveTab] = useState('hub');
  const [language, setLanguage] = useState('mr');
  const [weatherData, setWeatherData] = useState(null);
  const [isFetchingWeather, setIsFetchingWeather] = useState(false);
  const navigate = useNavigate();

  // --- LOGOUT LOGIC ---
  // Signs out from Supabase and redirects to the landing page root
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Navigate to landing page (root) where "Get Started" is located
      navigate('/');
    } catch (err) {
      console.error("Logout Error:", err.message);
    }
  };

  const fetchWeatherByGeoloc = () => {
    setIsFetchingWeather(true);
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`)
        .then(res => res.json())
        .then(data => {
          setWeatherData(data);
          setIsFetchingWeather(false);
        })
        .catch(err => {
          console.error("Weather Fetch Error:", err);
          setIsFetchingWeather(false);
        });
    }, () => setIsFetchingWeather(false));
  };


  // Fetching weather data on mount
  useEffect(() => {
    fetchWeatherByGeoloc();
  }, []);

  const translations = {
    en: { welcome: "AGRISETU", logout: "Logout", back: "Back to Dashboard", weatherTitle: "Weather Details", sowingTitle: "Sowing Guide" },
    hi: { welcome: "एग्रीसेतु", logout: "लॉग आउट", back: "डैशबोर्ड पर वापस", weatherTitle: "मौसम का विवरण", sowingTitle: "पेरणी मार्गदर्शन" },
    mr: { welcome: "अग्रिसेतू", logout: "लॉग आउट", back: "डॅशबोर्डवर परत जा", weatherTitle: "हवामान तपशील", sowingTitle: "पेरणी मार्गदर्शक" }
  };

  const t = translations[language];

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-10">

      {/* Navbar with Functional Logout */}
      <nav className="px-8 py-6 flex justify-between items-center max-w-7xl mx-auto sticky top-0 bg-[#FDFDFD]/80 backdrop-blur-md z-40 border-b border-slate-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#1B4332] rounded-xl flex items-center justify-center shadow-lg text-white font-black">A</div>
          <span className="text-2xl font-black tracking-tighter text-[#1B4332]">{t.welcome}</span>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-50 text-red-600 px-6 py-2 rounded-full font-bold text-sm hover:bg-red-100 transition-colors"
        >
          {t.logout}
        </button>
      </nav>

      <main className="max-w-7xl mx-auto px-6 mt-4">
        {activeTab === 'hub' ? (
          /* --- MAIN HUB VIEW --- */
          <div className="space-y-12 animate-in fade-in duration-500">
            <div className="py-10 text-center">
              <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-2">नमस्कार, शेतकरी मित्र! 👋</h1>
              <p className="text-slate-500 font-medium tracking-wide">तुमच्या प्रगतीचा सोबती - एग्रीसेतू</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-2">
              <FeatureCard icon="🏥" title="Krushi Doctor" desc="पीक रोग तपासणी" color="bg-emerald-500" onClick={() => setActiveTab('doctor')} />
              <FeatureCard icon="🤖" title="AI Assistant" desc="व्हॉइस असिस्टंट" color="bg-indigo-600" onClick={() => setActiveTab('ai')} />
              <FeatureCard icon="📊" title="Weather Stats" desc="हवामान आणि सल्ला" color="bg-blue-500" onClick={() => setActiveTab('stats')} />
            </div>
          </div>
        ) : (
          /* --- FEATURE CONTENT VIEW --- */
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            <button
              onClick={() => setActiveTab('hub')}
              className="flex items-center gap-2 mb-6 text-[#1B4332] font-black hover:translate-x-[-4px] transition-transform px-2"
            >
              <div className="w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center">
                <ArrowLeft size={20} />
              </div>
              <span className="uppercase tracking-widest text-xs font-bold">{t.back}</span>
            </button>

            <div className="overflow-hidden bg-white rounded-[3.5rem] shadow-2xl shadow-gray-200/40 border border-gray-50 min-h-[600px] mb-10">

              {/* Weather Stats Tab */}
              {activeTab === 'stats' && (
                <div className="animate-in fade-in duration-700">
                  <WeatherHero
                    currentLang={language}
                    setLang={setLanguage}
                    data={weatherData}
                    onUseCurrentLocation={fetchWeatherByGeoloc}
                    onRefresh={fetchWeatherByGeoloc}
                  />

                  <div className="p-6 md:p-12 space-y-8">
                    <section>
                      <SowingCalendar weatherData={weatherData} />
                    </section>

                    <section>
                      <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2 px-2">
                        <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
                        {t.weatherTitle}
                      </h3>
                      <StatsGrid data={weatherData} language={language} />
                    </section>
                  </div>
                </div>
              )}

              {/* AI Assistant Tab */}
              {activeTab === 'ai' && (
                <div className="p-8 md:p-12">
                  <AIAssistant language={language} setLanguage={setLanguage} />
                </div>
              )}

              {/* Krushi Doctor Tab */}
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

const FeatureCard = ({ icon, title, desc, color, onClick }) => (
  <button
    onClick={onClick}
    className="group bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all text-left w-full"
  >
    <div className={`${color} w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6 text-white shadow-lg group-hover:rotate-6 transition-transform`}>
      {icon}
    </div>
    <h3 className="text-2xl font-black text-gray-900 tracking-tighter">{title}</h3>
    <p className="text-slate-400 font-bold text-sm mt-1">{desc}</p>
    <p className="text-[#1B4332] mt-6 text-xs font-black uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all">
      Open Tab <span>→</span>
    </p>
  </button>
);

export default FarmerDashboard;