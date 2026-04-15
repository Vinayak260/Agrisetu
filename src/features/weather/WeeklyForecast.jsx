
import React from 'react';
import { Share2, CloudRain } from 'lucide-react';

const WeeklyForecast = ({ forecastList }) => {
  // Logic to group 40 entries into 5 unique days
  const getUniqueDays = (list) => {
    if (!list) return [];
    const daily = [];
    const dates = new Set();
    for (const item of list) {
      const date = item.dt_txt.split(' ')[0];
      if (!dates.has(date)) {
        dates.add(date);
        daily.push(item);
      }
      if (daily.length === 5) break;
    }
    return daily;
  };

  const displayList = getUniqueDays(forecastList);

  // Fallback if data is missing
  if (displayList.length === 0) return null;

  return (
    <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/40 animate-in fade-in slide-in-from-bottom-10">
      <div className="flex justify-between items-center mb-10 px-2">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 rounded-2xl text-blue-600 shadow-inner">
             <CloudRain size={20} />
          </div>
          <h3 className="text-xl font-black text-slate-800 tracking-tight">5-Day Weather Forecast</h3>
        </div>
        <button className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg active:scale-95">
          <Share2 size={16} />
          <span className="text-[11px] font-black uppercase tracking-wider text-white">Share</span>
        </button>
      </div>
      
      <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
        {displayList.map((item, index) => {
          const date = new Date(item.dt * 1000);
          const dayName = index === 0 ? "Today" : index === 1 ? "Tomorrow" : date.toLocaleDateString('en-US', { weekday: 'short' });
          
          return (
            <div key={index} className={`min-w-[150px] flex-1 p-6 rounded-[2.5rem] border transition-all duration-500 ${index === 0 ? 'bg-white border-indigo-100 shadow-2xl scale-105 z-10' : 'bg-slate-50/50 border-slate-100'}`}>
              <p className={`text-sm font-black mb-6 ${index === 0 ? 'text-indigo-600' : 'text-slate-800'}`}>{dayName}</p>
              
              <div className="w-16 h-16 flex items-center justify-center mx-auto mb-6 bg-white rounded-2xl shadow-sm border border-slate-50">
                 <img src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`} alt="icon" className="w-12 h-12" />
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-1.5">
                  <span className="text-[10px] text-rose-500 font-black">↗</span>
                  <p className="text-xl font-black text-slate-800">{Math.round(item.main.temp_max)}°</p>
                </div>
                <div className="flex items-center justify-center gap-1.5">
                  <span className="text-[10px] text-blue-500 font-black">↘</span>
                  <p className="text-sm font-bold text-slate-400">{Math.round(item.main.temp_min)}°</p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100/50">
                <div className="bg-blue-50 py-2 rounded-full border border-blue-100 flex items-center justify-center gap-1">
                  <span className="text-[9px] font-black text-blue-500 uppercase tracking-tighter">💧 {Math.round(item.pop * 100)}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeeklyForecast;