

import React from 'react';
import { Droplets, Wind, Eye, Sun, Gauge, CloudRain, Thermometer } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, unit, colorClass }) => (
  <div className={`p-4 rounded-2xl border transition-all hover:scale-[1.02] ${colorClass}`}>
    <div className="flex items-center gap-2 mb-3">
      <div className="opacity-70">
        <Icon size={16} />
      </div>
      <span className="text-[9px] font-black uppercase tracking-widest opacity-60">{label}</span>
    </div>
    <div className="flex items-baseline gap-1">
      <span className="text-xl font-black text-slate-800">{value}</span>
      <span className="text-xs font-bold text-slate-400">{unit}</span>
    </div>
  </div>
);

const StatsGrid = ({ data }) => {
  // Logic to calculate extra metrics
  const stats = [
    { icon: Droplets, label: 'Humidity', value: data?.main?.humidity || 20, unit: '%', colorClass: 'bg-blue-50 border-blue-100 text-blue-600' },
    { icon: Wind, label: 'Wind', value: Math.round(data?.wind?.speed * 3.6) || 9, unit: 'km/h', colorClass: 'bg-emerald-50 border-emerald-100 text-emerald-600' },
    { icon: Eye, label: 'Visibility', value: (data?.visibility || 10000) / 1000, unit: 'km', colorClass: 'bg-purple-50 border-purple-100 text-purple-600' },
    { icon: Sun, label: 'UV Index', value: '6', unit: '', colorClass: 'bg-orange-50 border-orange-100 text-orange-600' },
    { icon: Gauge, label: 'Pressure', value: data?.main?.pressure || 1010, unit: 'hPa', colorClass: 'bg-indigo-50 border-indigo-100 text-indigo-600' },
    { icon: CloudRain, label: 'Precipitation', value: '0', unit: 'mm', colorClass: 'bg-cyan-50 border-cyan-100 text-cyan-600' }
  ];

  return (
    <div className="space-y-4 animate-in fade-in duration-700">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>
      
      {/* Feels Like Card - Positioned at bottom like reference */}
      <div className="w-1/2 lg:w-1/4">
        <StatCard 
          icon={Thermometer} 
          label="Feels Like" 
          value={Math.round(data?.main?.feels_like) || 29} 
          unit="°C" 
          colorClass="bg-rose-50 border-rose-100 text-rose-600" 
        />
      </div>
    </div>
  );
};

export default StatsGrid;