
import React from 'react';
import { MapPin, RefreshCw } from 'lucide-react';

const WeatherHero = ({ data, currentLang, setLang }) => {
  return (
    <div className="bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden">
      <div className="relative z-10 flex justify-between items-start">
        <div className="flex gap-3 items-center">
          <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md border border-white/20">
            <MapPin size={20} />
          </div>
          <h2 className="text-xl font-black tracking-tight">{data?.name || "Pune"}</h2>
        </div>
        <div className="text-right">
          <h1 className="text-5xl font-black">{Math.round(data?.main?.temp)}°C</h1>
          <p className="text-xs font-bold opacity-80 uppercase tracking-widest mt-1">{data?.weather[0]?.description}</p>
        </div>
      </div>
      <div className="mt-10 flex justify-between items-center relative z-10">
        <div className="bg-emerald-500/20 px-4 py-2 rounded-full border border-emerald-400/30 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
          Using current location
        </div>
        <button className="opacity-50 hover:opacity-100 transition-opacity"><RefreshCw size={14} /></button>
      </div>
    </div>
  );
};
export default WeatherHero;
