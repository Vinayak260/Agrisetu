

import React, { useState, useEffect } from 'react';
import { CheckCircle, Zap, Clock, Info, AlertTriangle, Sprout } from 'lucide-react';
import { getAIFarmingAdvice } from '../../utils/agriWeatherLogic';
import { getSowingRecommendations } from '../../utils/sowingLogic';

const CropRecommendationCard = ({ crop }) => {
  return (
    <div className="p-4 rounded-2xl border border-blue-100 bg-blue-50 transition-all hover:scale-[1.01] flex items-start gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-3xl bg-white p-2 rounded-xl shadow-sm">{crop.icon}</div>
      <div className="flex-1">
        <h4 className="text-sm font-black text-slate-800 leading-tight">{crop.name}</h4>
        <p className="text-[10px] font-bold text-slate-500 leading-relaxed italic mt-1">
          {crop.advice}
        </p>
        <div className="flex items-center gap-2 mt-2">
           <span className="text-[8px] font-black text-blue-700 bg-blue-200 px-2 py-0.5 rounded-full uppercase tracking-tighter">
             Temp: {crop.minTemp}-{crop.maxTemp}°C
           </span>
           <span className="text-[8px] font-black text-cyan-700 bg-cyan-200 px-2 py-0.5 rounded-full uppercase tracking-tighter">
             Max Hum: {crop.maxHumidity}%
           </span>
        </div>
      </div>
    </div>
  );
};

const RecommendationCard = ({ type, title, subtitle, priority }) => {
  const isHigh = priority === "high";
  const bgColor = type === "success" ? "bg-emerald-50 border-emerald-100" : "bg-rose-50 border-rose-100";
  const iconColor = type === "success" ? "text-emerald-500" : "text-rose-500";
  const badgeColor = type === "success" ? "bg-emerald-200 text-emerald-700" : "bg-rose-200 text-rose-700";

  return (
    <div className={`p-5 rounded-2xl border ${bgColor} transition-all hover:scale-[1.01] animate-in fade-in slide-in-from-right-4 duration-500`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {type === "success" ? (
            <CheckCircle size={16} className={iconColor} />
          ) : (
            <AlertTriangle size={16} className={iconColor} />
          )}
          <h4 className="text-xs font-black text-slate-800 leading-tight">{title}</h4>
        </div>
        <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter ${badgeColor}`}>
          {priority} Priority
        </span>
      </div>

      <div className="ml-6 space-y-2">
        <p className="text-[10px] font-bold text-slate-500 leading-relaxed italic">
          {subtitle}
        </p>
        <div className="flex items-center gap-2 pt-2 border-t border-slate-900/5">
          <Clock size={10} className="text-slate-400" />
          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
            AI Generated Recommendation
          </span>
        </div>
      </div>
    </div>
  );
};

const SowingCalendar = ({ weatherData, language = 'mr' }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loadingAI, setLoadingAI] = useState(true);

  const recommendedCrops = getSowingRecommendations(weatherData);

  useEffect(() => {
    if (!weatherData) return;

    setLoadingAI(true);
    getAIFarmingAdvice(weatherData, language).then(data => {
      setRecommendations(data);
      setLoadingAI(false);
    });
  }, [weatherData, language]);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center gap-2 px-1">
        <Zap size={18} className="text-emerald-500 fill-emerald-500" />
        <h3 className="text-sm font-black text-slate-800 uppercase tracking-[0.15em]">
          AI Farming Recommendations
        </h3>
      </div>

      <div className="space-y-4">
        {loadingAI ? (
          <div className="p-4 border border-slate-100 bg-slate-50 rounded-2xl text-center text-xs font-bold text-slate-400 animate-pulse uppercase tracking-widest">
            Analyzing Weather Data with Groq AI...
          </div>
        ) : (
          recommendations.map((rec, idx) => (
            <RecommendationCard
              key={idx}
              type={rec.type}
              title={rec.title}
              subtitle={rec.subtitle}
              priority={rec.priority}
            />
          ))
        )}
      </div>

      {/* Recommended Crops Section */}
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
               <CropRecommendationCard key={idx} crop={crop} />
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