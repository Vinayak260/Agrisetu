import React, { useState, useEffect } from 'react';
import { CheckCircle, Zap, Clock, AlertTriangle, Sprout, UserCog } from 'lucide-react';
import { getAIFarmingAdvice } from '../../utils/agriWeatherLogic';
import { getSowingRecommendations } from '../../utils/sowingLogic';

// ── Sub-components ───────────────────────────────────────────────────────────

const CropRecommendationCard = ({ crop, isPrimary }) => (
  <div className={`p-4 rounded-2xl border transition-all hover:scale-[1.01] flex items-start gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500
    ${isPrimary
      ? 'border-emerald-300 bg-emerald-50 ring-2 ring-emerald-200'
      : 'border-blue-100 bg-blue-50'}`}
  >
    <div className="text-3xl bg-white p-2 rounded-xl shadow-sm relative">
      {crop.icon}
      {isPrimary && (
        <span className="absolute -top-1.5 -right-1.5 text-[8px] bg-emerald-500 text-white font-black px-1 py-0.5 rounded-full">
          YOUR CROP
        </span>
      )}
    </div>
    <div className="flex-1">
      <h4 className="text-sm font-black text-slate-800 leading-tight">{crop.name}</h4>
      <p className="text-[10px] font-bold text-slate-500 leading-relaxed italic mt-1">{crop.advice}</p>
      <div className="flex items-center gap-2 mt-2 flex-wrap">
        <span className="text-[8px] font-black text-blue-700 bg-blue-200 px-2 py-0.5 rounded-full uppercase tracking-tighter">
          Temp: {crop.minTemp}–{crop.maxTemp}°C
        </span>
        <span className="text-[8px] font-black text-cyan-700 bg-cyan-200 px-2 py-0.5 rounded-full uppercase tracking-tighter">
          Max Humidity: {crop.maxHumidity}%
        </span>
      </div>
    </div>
  </div>
);

const RecommendationCard = ({ type, title, subtitle, priority }) => {
  const bgColor = type === 'success' ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100';
  const iconColor = type === 'success' ? 'text-emerald-500' : 'text-rose-500';
  const badgeColor = type === 'success' ? 'bg-emerald-200 text-emerald-700' : 'bg-rose-200 text-rose-700';

  return (
    <div className={`p-5 rounded-2xl border ${bgColor} transition-all hover:scale-[1.01] animate-in fade-in slide-in-from-right-4 duration-500`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {type === 'success'
            ? <CheckCircle size={16} className={iconColor} />
            : <AlertTriangle size={16} className={iconColor} />}
          <h4 className="text-xs font-black text-slate-800 leading-tight">{title}</h4>
        </div>
        <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter ${badgeColor}`}>
          {priority} Priority
        </span>
      </div>
      <div className="ml-6 space-y-2">
        <p className="text-[10px] font-bold text-slate-500 leading-relaxed italic">{subtitle}</p>
        <div className="flex items-center gap-2 pt-2 border-t border-slate-900/5">
          <Clock size={10} className="text-slate-400" />
          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
            AI Generated · Live Weather Analysis
          </span>
        </div>
      </div>
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────

const SowingCalendar = ({ weatherData, language = 'mr', farmerProfile = null, onSetupProfile }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loadingAI, setLoadingAI] = useState(true);

  // Pass farmerProfile to both logic functions
  const recommendedCrops = getSowingRecommendations(weatherData, farmerProfile);

  useEffect(() => {
    if (!weatherData) return;

    setLoadingAI(true);
    // Pass farmerProfile to the AI function for personalized advice
    getAIFarmingAdvice(weatherData, language, farmerProfile).then(data => {
      setRecommendations(data);
      setLoadingAI(false);
    });
  }, [weatherData, language, farmerProfile]);

  return (
    <div className="space-y-6">

      {/* ── AI Farming Recommendations Header ── */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Zap size={18} className="text-emerald-500 fill-emerald-500" />
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-[0.15em]">
            AI Farming Recommendations
          </h3>
        </div>

        {/* Farmer profile badge / setup button */}
        {farmerProfile ? (
          <button
            onClick={onSetupProfile}
            className="flex items-center gap-1.5 text-[9px] font-black text-emerald-700 bg-emerald-100 hover:bg-emerald-200 px-3 py-1.5 rounded-full uppercase tracking-widest transition-colors"
          >
            <UserCog size={11} />
            {farmerProfile.crop ? farmerProfile.crop.toUpperCase() : 'PROFILE'} · Edit Profile
          </button>
        ) : (
          <button
            onClick={onSetupProfile}
            className="flex items-center gap-1.5 text-[9px] font-black text-blue-700 bg-blue-100 hover:bg-blue-200 px-3 py-1.5 rounded-full uppercase tracking-widest transition-colors animate-pulse"
          >
            <UserCog size={11} />
            Setup Farmer Profile
          </button>
        )}
      </div>

      {/* ── Personalized tip banner ── */}
      {farmerProfile && (
        <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-200 rounded-2xl px-4 py-3 animate-in fade-in duration-500">
          <span className="text-xl">🎯</span>
          <p className="text-[10px] font-black text-emerald-800 leading-snug">
            Personalized for your <span className="uppercase">{farmerProfile.crop || 'selected'}</span> crop
            &nbsp;·&nbsp; Based on live GPS weather at <strong>{weatherData?.name || 'your location'}</strong>
          </p>
        </div>
      )}

      {/* ── Recommendation cards ── */}
      <div className="space-y-4">
        {loadingAI ? (
          <div className="p-6 border border-slate-100 bg-slate-50 rounded-2xl text-center space-y-2 animate-pulse">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
              {farmerProfile
                ? `Analyzing ${farmerProfile.crop || 'your'} crop conditions with Groq AI...`
                : 'Analyzing Weather Data with Groq AI...'}
            </p>
            <div className="flex justify-center gap-1 mt-2">
              {[0,1,2].map(i => (
                <div key={i} className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        ) : recommendations.length > 0 ? (
          recommendations.map((rec, idx) => (
            <RecommendationCard
              key={idx}
              type={rec.type}
              title={rec.title}
              subtitle={rec.subtitle}
              priority={rec.priority}
            />
          ))
        ) : (
          <div className="p-4 border border-slate-100 bg-slate-50 rounded-2xl text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
            No recommendations available
          </div>
        )}
      </div>

      {/* ── Recommended Crops Section ── */}
      <div className="pt-6 mt-6 border-t border-slate-100/60">
        <div className="flex items-center gap-2 px-1 mb-4">
          <Sprout size={18} className="text-blue-500" />
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-[0.15em]">
            Recommended Crops to Sow
          </h3>
        </div>

        {recommendedCrops.length > 0 ? (
          <div className="space-y-3">
            {recommendedCrops.map((crop, idx) => (
              <CropRecommendationCard
                key={idx}
                crop={crop}
                isPrimary={farmerProfile?.crop === crop.value}
              />
            ))}
          </div>
        ) : (
          <div className="p-4 border border-slate-100 bg-slate-50 rounded-2xl text-center text-xs font-bold text-slate-500 uppercase tracking-widest">
            No Specific Crops Match Current Conditions
          </div>
        )}
      </div>
    </div>
  );
};

export default SowingCalendar;