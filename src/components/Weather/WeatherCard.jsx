/*
import React from 'react';
import { Wind, Thermometer, Droplets, Volume2, ShieldCheck, AlertTriangle, XCircle } from 'lucide-react';

const WeatherCard = ({ weather, advice }) => {
  // Mapping statuses to specific UI colors and icons
  const getStatusStyles = (status) => {
    switch (status) {
      case 'danger': return { bg: 'bg-red-50', border: 'border-red-500', text: 'text-red-900', icon: <XCircle className="text-red-500" /> };
      case 'warning': return { bg: 'bg-orange-50', border: 'border-orange-500', text: 'text-orange-900', icon: <AlertTriangle className="text-orange-500" /> };
      default: return { bg: 'bg-green-50', border: 'border-green-500', text: 'text-green-900', icon: <ShieldCheck className="text-green-500" /> };
    }
  };

  return (
    <div className="space-y-4">
    
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-1 text-orange-500">
            <Thermometer size={18} />
            <span className="text-xs font-bold uppercase">तापमान</span>
          </div>
          <p className="text-3xl font-black">{Math.round(weather.main.temp)}°C</p>
        </div>

        <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-1 text-blue-500">
            <Wind size={18} />
            <span className="text-xs font-bold uppercase">वारा</span>
          </div>
          <p className="text-3xl font-black">{Math.round(weather.wind.speed * 3.6)} <span className="text-sm font-normal">km/h</span></p>
        </div>
      </div>

     
      <h3 className="font-black text-slate-700 mt-6 px-1">महत्वाचा सल्ला (Advice)</h3>
      
      {Object.keys(advice).map((key) => {
        const style = getStatusStyles(advice[key].status);
        return (
          <div key={key} className={`${style.bg} ${style.border} border-l-8 p-4 rounded-2xl shadow-sm flex items-start justify-between transition-all hover:shadow-md`}>
            <div className="flex gap-3">
              <div className="mt-1">{style.icon}</div>
              <div>
                <p className="text-[10px] uppercase font-black opacity-50 mb-0.5">{key}</p>
                <p className={`font-bold leading-tight ${style.text}`}>{advice[key].text}</p>
              </div>
            </div>
           
            <button className="p-2 bg-white rounded-full shadow-sm active:scale-90 transition-transform">
              <Volume2 size={18} className="text-slate-600" />
            </button>
          </div>
        );
      })}

     
      <div className="flex items-center justify-center gap-2 py-4 text-slate-400">
        <Droplets size={16} />
        <p className="text-sm font-medium">हवेतील ओलावा (Humidity): {weather.main.humidity}%</p>
      </div>
    </div>
  );
};

export default WeatherCard;
*/


import React from 'react';
import { Volume2, CheckCircle, AlertTriangle } from 'lucide-react';

const WeatherCard = ({ title, content, status = 'info' }) => {
  const styles = {
    danger: 'bg-rose-50 border-rose-100 text-rose-900 icon-rose-500',
    warning: 'bg-amber-50 border-amber-100 text-amber-900 icon-amber-500',
    success: 'bg-emerald-50 border-emerald-100 text-emerald-900 icon-emerald-500',
    info: 'bg-slate-50 border-slate-100 text-slate-900 icon-indigo-500'
  }[status];

  return (
    <div className={`${styles} border p-6 rounded-[2rem] shadow-sm flex items-start justify-between transition-all hover:shadow-md hover:scale-[1.02]`}>
      <div className="flex gap-4">
        <div className="mt-1">
          {status === 'danger' || status === 'warning' ? <AlertTriangle size={20} /> : <CheckCircle size={20} />}
        </div>
        <div>
          <p className="text-[10px] uppercase font-black opacity-40 mb-1 tracking-widest">{title}</p>
          <p className="font-bold leading-tight text-sm">{content}</p>
        </div>
      </div>
      <button className="p-3 bg-white rounded-full shadow-sm active:scale-90 transition-transform">
        <Volume2 size={18} className="text-slate-400" />
      </button>
    </div>
  );
};

export default WeatherCard;