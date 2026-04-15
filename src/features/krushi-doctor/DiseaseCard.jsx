




import React from 'react';
import { ShieldAlert, Wind, ListChecks, Stethoscope, Info, CheckCircle, Droplets } from 'lucide-react';

const DiseaseCard = ({ data, labels }) => {
  return (
    <div className="p-8 rounded-[3rem] bg-white shadow-2xl border border-slate-100 space-y-8 animate-in slide-in-from-bottom-6 duration-700">
      <div className="flex items-center gap-4 pb-6 border-b border-slate-50">
        <div className="bg-rose-500 p-4 rounded-2xl shadow-lg"><ShieldAlert className="text-white" size={28} /></div>
        <div>
          <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">{data.crop}</p>
          <h4 className="text-2xl font-black text-slate-800 tracking-tight">{data.name}</h4>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-50/50 p-5 rounded-[2rem] border border-blue-100/50">
          <div className="flex items-center gap-2 mb-2"><Info size={14} className="text-blue-600" /><h5 className="text-[10px] font-black text-blue-600 uppercase">{labels.cause}</h5></div>
          <p className="text-xs font-bold text-slate-600 leading-relaxed">{data.cause}</p>
        </div>
        <div className="bg-amber-50/50 p-5 rounded-[2rem] border border-amber-100/50">
          <div className="flex items-center gap-2 mb-2"><Wind size={14} className="text-amber-600" /><h5 className="text-[10px] font-black text-amber-600 uppercase">{labels.transmission}</h5></div>
          <p className="text-xs font-bold text-slate-600 leading-relaxed">{data.transmission}</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2"><Stethoscope size={16} className="text-rose-500" /><h5 className="text-xs font-black text-slate-800 uppercase">{labels.symptoms}</h5></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {data.symptoms?.map((s, i) => (
            <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] font-bold text-slate-600 flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-rose-400" />{s}</div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{labels.immediate}</h5>
          {data.immediate_care?.map((c, i) => (
            <div key={i} className="flex gap-2 p-3 bg-emerald-50 rounded-xl text-[11px] font-bold text-slate-700"><CheckCircle size={12} className="text-emerald-500 mt-0.5" />{c}</div>
          ))}
        </div>
        <div className="space-y-3">
          <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{labels.prevention}</h5>
          {data.preventative_care?.map((p, i) => (
            <div key={i} className="flex gap-2 p-3 bg-blue-50 rounded-xl text-[11px] font-bold text-slate-700"><Droplets size={12} className="text-blue-500 mt-0.5" />{p}</div>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center pt-6 border-t border-slate-100">
        <div className="flex gap-8">
          <div className="text-center"><p className="text-[9px] font-black text-slate-400 uppercase mb-1">{labels.health}</p><p className="text-xl font-black text-emerald-500">{data.healthy}%</p></div>
          <div className="text-center"><p className="text-[9px] font-black text-slate-400 uppercase mb-1">{labels.infection}</p><p className="text-xl font-black text-rose-500">{data.infected}%</p></div>
        </div>
        <div className="bg-emerald-50 text-emerald-600 px-6 py-2 rounded-xl text-[9px] font-black uppercase border border-emerald-100 flex items-center gap-2"><CheckCircle size={14} /> Solution Verified</div>
      </div>
    </div>
  );
};

export default DiseaseCard;