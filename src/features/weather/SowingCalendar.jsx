

import React from 'react';
import { CheckCircle, Zap, Clock, Info, AlertTriangle } from 'lucide-react';

const RecommendationCard = ({ type, title, subtitle, priority }) => {
  // Logic for color coding based on type
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
            Early morning 6-8 AM recommended
          </span>
        </div>
      </div>
    </div>
  );
};

const SowingCalendar = ({ weatherData }) => {
  // Logic: In a real app, you would determine these based on weatherData
  const temp = Math.round(weatherData?.main?.temp || 30);
  const windSpeed = weatherData?.wind?.speed || 9;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center gap-2 px-1">
        <Zap size={18} className="text-emerald-500 fill-emerald-500" />
        <h3 className="text-sm font-black text-slate-800 uppercase tracking-[0.15em]">
          Farming Recommendations
        </h3>
      </div>

      <div className="space-y-4">
        {/* Recommendation 1: Spraying */}
        <RecommendationCard 
          type={windSpeed < 10 ? "success" : "warning"}
          title="Perfect spraying conditions"
          subtitle="Low wind speed ideal for pesticide and fertilizer application."
          priority="high"
        />

        {/* Recommendation 2: Growth */}
        <RecommendationCard 
          type={temp < 35 ? "success" : "warning"}
          title={temp < 35 ? "Optimal growing conditions" : "Heat stress warning"}
          subtitle={temp < 35 
            ? "Temperature range is ideal for most farming activities." 
            : "Extreme heat detected. Increase irrigation frequency."
          }
          priority={temp < 35 ? "low" : "high"}
        />
      </div>
    </div>
  );
};

export default SowingCalendar;