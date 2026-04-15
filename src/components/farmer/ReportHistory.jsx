import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { History, Loader2, AlertCircle } from 'lucide-react';

const ReportHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        // Get the current logged-in user to filter history correctly
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data, error } = await supabase
            .from('diagnosis_history')
            .select('*')
            .eq('user_id', user.id) // IMPORTANT: Filter by user_id
            .order('created_at', { ascending: true });

          if (error) throw error;
          setHistory(data || []);
        }
      } catch (err) {
        console.error("History fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) return (
    <div className="flex justify-center py-10">
      <Loader2 className="animate-spin text-green-500" size={32} />
    </div>
  );

  // If no history exists, return a friendly empty state
  if (history.length === 0) return (
    <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl text-center">
      <AlertCircle className="mx-auto text-slate-300 mb-4" size={40} />
      <p className="text-slate-400 font-black uppercase text-xs tracking-widest">No scan history available yet</p>
    </div>
  );

  return (
    <div className="p-8 rounded-[3rem] bg-slate-900 border border-slate-800 shadow-2xl text-white animate-in fade-in duration-700">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-green-500/20 rounded-2xl border border-green-500/30">
          <History className="text-green-400" />
        </div>
        <div>
          <h3 className="text-2xl font-black tracking-tight">Health Progress</h3>
          <p className="text-xs text-white/50 uppercase font-black tracking-widest">
            Infection Trend • {history[history.length - 1]?.crop_name}
          </p>
        </div>
      </div>

      {/* FIX: Parent container has a defined height to solve Recharts -1 error */}
      <div className="h-72 w-full mb-10">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={history} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis 
              dataKey="created_at" 
              hide 
            />
            <YAxis 
              stroke="rgba(255,255,255,0.3)" 
              fontSize={10} 
              fontWeight="bold"
              axisLine={false}
              tickLine={false}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1E293B', 
                border: '1px solid rgba(255,255,255,0.1)', 
                borderRadius: '16px',
                fontSize: '12px',
                fontWeight: 'bold'
              }}
              itemStyle={{ color: '#F87171' }}
              labelStyle={{ display: 'none' }}
            />
            <Line 
              type="monotone" 
              dataKey="infected_percentage" 
              stroke="#F87171" 
              strokeWidth={4} 
              dot={{ r: 6, fill: '#F87171', strokeWidth: 0 }} 
              activeDot={{ r: 8, strokeWidth: 0 }}
              animationDuration={2000}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* History List */}
      <div className="grid gap-4 max-h-96 overflow-y-auto pr-2 no-scrollbar">
        {history.slice().reverse().map((report) => (
          <div key={report.id} className="flex justify-between items-center p-5 bg-white/5 rounded-[2rem] border border-white/5 hover:bg-white/10 transition-all group">
            <div className="flex items-center gap-4">
              <div className="w-2 h-10 bg-green-500/20 rounded-full group-hover:bg-green-500 transition-colors" />
              <div>
                <p className="font-black text-slate-100 leading-none mb-1">{report.disease_name}</p>
                <p className="text-[10px] opacity-40 uppercase font-black tracking-tighter">
                  {new Date(report.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-sm font-black ${report.infected_percentage > 25 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {report.infected_percentage}% Infected
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportHistory;