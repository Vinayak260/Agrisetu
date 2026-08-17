import React from 'react';
import { Droplets, Wind, Eye, Sun, Gauge, CloudRain, Thermometer, ArrowUp, ArrowDown } from 'lucide-react';

// ── UV Index helper ────────────────────────────────────────────────────────
const getUVLabel = (uvi) => {
  if (uvi === null || uvi === undefined) return { level: '--', color: 'text-slate-400' };
  if (uvi <= 2)  return { level: 'Low',       color: 'text-green-600' };
  if (uvi <= 5)  return { level: 'Moderate',  color: 'text-yellow-600' };
  if (uvi <= 7)  return { level: 'High',       color: 'text-orange-600' };
  if (uvi <= 10) return { level: 'Very High',  color: 'text-red-600' };
  return           { level: 'Extreme',         color: 'text-purple-700' };
};

// ── Wind direction helper ──────────────────────────────────────────────────
const getWindDir = (deg) => {
  if (deg === undefined || deg === null) return '';
  const dirs = ['N','NE','E','SE','S','SW','W','NW'];
  return dirs[Math.round(deg / 45) % 8];
};

// ── StatCard ───────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, unit, colorClass, subLabel }) => (
  <div className={`p-4 rounded-2xl border transition-all hover:scale-[1.02] hover:shadow-md ${colorClass}`}>
    <div className="flex items-center gap-2 mb-3">
      <div className="opacity-70"><Icon size={15} /></div>
      <span className="text-[9px] font-black uppercase tracking-widest opacity-60">{label}</span>
    </div>
    <div className="flex items-baseline gap-1">
      <span className="text-xl font-black text-slate-800">{value ?? '--'}</span>
      <span className="text-xs font-bold text-slate-400">{unit}</span>
    </div>
    {subLabel && (
      <p className="text-[9px] font-bold text-slate-400 mt-1">{subLabel}</p>
    )}
  </div>
);

// ── Main StatsGrid ─────────────────────────────────────────────────────────
const StatsGrid = ({ data, uvIndex = null }) => {
  if (!data) return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 animate-pulse">
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} className="h-20 bg-slate-100 rounded-2xl" />
      ))}
    </div>
  );

  const humidity     = data.main?.humidity;
  const windSpeed    = data.wind?.speed ? Math.round(data.wind.speed * 3.6) : null;
  const windDeg      = data.wind?.deg;
  const visibility   = data.visibility ? (data.visibility / 1000).toFixed(1) : null;
  const pressure     = data.main?.pressure;
  const feelsLike    = data.main?.feels_like ? Math.round(data.main.feels_like) : null;
  const tempMin      = data.main?.temp_min ? Math.round(data.main.temp_min) : null;
  const tempMax      = data.main?.temp_max ? Math.round(data.main.temp_max) : null;

  // Precipitation: OWM puts rain in rain.1h or snow.1h
  const rain1h  = data.rain?.['1h'] ?? null;
  const snow1h  = data.snow?.['1h'] ?? null;
  const precip  = rain1h !== null ? rain1h : snow1h !== null ? snow1h : 0;

  // Cloudiness
  const clouds = data.clouds?.all ?? null;

  // UV from One Call API (passed as prop if available) or omit
  const uvLabel = getUVLabel(uvIndex);

  const stats = [
    {
      icon: Droplets,
      label: 'Humidity',
      value: humidity,
      unit: '%',
      colorClass: 'bg-blue-50 border-blue-100 text-blue-600',
      subLabel: humidity >= 80 ? '⚠️ High – fungal risk' : humidity <= 30 ? '🌵 Dry conditions' : null,
    },
    {
      icon: Wind,
      label: 'Wind Speed',
      value: windSpeed,
      unit: 'km/h',
      colorClass: 'bg-emerald-50 border-emerald-100 text-emerald-600',
      subLabel: windDeg !== undefined ? `Direction: ${getWindDir(windDeg)} (${windDeg}°)` : null,
    },
    {
      icon: Eye,
      label: 'Visibility',
      value: visibility,
      unit: 'km',
      colorClass: 'bg-purple-50 border-purple-100 text-purple-600',
      subLabel: visibility !== null && visibility < 1 ? '🌫️ Poor – dense fog' : null,
    },
    {
      icon: Sun,
      label: 'UV Index',
      value: uvIndex !== null ? uvIndex : '—',
      unit: '',
      colorClass: 'bg-orange-50 border-orange-100 text-orange-600',
      subLabel: uvIndex !== null ? uvLabel.level : 'One Call API needed',
    },
    {
      icon: Gauge,
      label: 'Pressure',
      value: pressure,
      unit: 'hPa',
      colorClass: 'bg-indigo-50 border-indigo-100 text-indigo-600',
      subLabel: pressure < 1000 ? '🌧️ Low – possible rain' : pressure > 1020 ? '☀️ High – fair weather' : null,
    },
    {
      icon: CloudRain,
      label: 'Precipitation',
      value: precip.toFixed(1),
      unit: 'mm',
      colorClass: 'bg-cyan-50 border-cyan-100 text-cyan-600',
      subLabel: clouds !== null ? `☁️ Cloud cover: ${clouds}%` : null,
    },
  ];

  return (
    <div className="space-y-4 animate-in fade-in duration-700">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {stats.map((stat, i) => <StatCard key={i} {...stat} />)}
      </div>

      {/* Bottom row: Feels Like + Min/Max temp */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        <StatCard
          icon={Thermometer}
          label="Feels Like"
          value={feelsLike}
          unit="°C"
          colorClass="bg-rose-50 border-rose-100 text-rose-600"
        />
        <div className="p-4 rounded-2xl border bg-amber-50 border-amber-100 text-amber-700 transition-all hover:scale-[1.02] hover:shadow-md">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[9px] font-black uppercase tracking-widest opacity-60">Today's Range</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <ArrowUp size={12} className="text-rose-500" />
              <span className="text-lg font-black text-slate-800">{tempMax ?? '--'}°</span>
            </div>
            <span className="text-slate-300 font-bold">/</span>
            <div className="flex items-center gap-1">
              <ArrowDown size={12} className="text-blue-500" />
              <span className="text-lg font-black text-slate-800">{tempMin ?? '--'}°</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsGrid;