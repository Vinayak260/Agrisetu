/*
import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, UserPlus, ShieldAlert } from 'lucide-react';

const Dashboard = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Simulated Backend Data
    setData([
      { name: 'Jan', users: 45 }, { name: 'Feb', users: 52 },
      { name: 'Mar', users: 60 }, { name: 'Apr', users: 72 },
      { name: 'May', users: 85 }, { name: 'Jun', users: 95 },
      { name: 'Jul', users: 112 }, { name: 'Aug', users: 128 },
      { name: 'Sep', users: 145 }, { name: 'Oct', users: 162 },
      { name: 'Nov', users: 178 }, { name: 'Dec', users: 195 },
    ]);
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Dashboard</h2>

      
      <div className="bg-[#4a89ff] rounded-[3rem] p-8 md:p-12 shadow-2xl overflow-hidden relative border border-white/10">
        <h3 className="text-white text-2xl font-semibold mb-8">Monthly User Analytics</h3>
        <div className="bg-white rounded-[2.5rem] p-6 h-[400px] shadow-inner">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 13}} dy={15} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 13}} dx={-10} />
              <Tooltip 
                contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}} 
              />
              <Line 
                type="monotone" 
                dataKey="users" 
                stroke="#17a34a" 
                strokeWidth={5} 
                dot={{ r: 7, fill: '#17a34a', strokeWidth: 3, stroke: '#fff' }}
                activeDot={{ r: 9, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <StatCard label="Total Users" value="1,847" icon={<Users size={28}/>} color="bg-green-100 text-green-600" />
        <StatCard label="Pending Users" value="23" icon={<UserPlus size={28}/>} color="bg-blue-100 text-blue-600" />
        <StatCard label="Restricted Users" value="12" icon={<ShieldAlert size={28}/>} color="bg-red-100 text-red-600" />
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon, color }) => (
  <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex justify-between items-center transition-all hover:shadow-md hover:-translate-y-1">
    <div>
      <p className="text-slate-500 font-medium mb-1">{label}</p>
      <p className="text-4xl font-black text-slate-800 tracking-tight">{value}</p>
    </div>
    <div className={`p-5 rounded-2xl ${color}`}>{icon}</div>
  </div>
);

export default Dashboard;

*/
/*
import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, UserPlus, ShieldAlert } from 'lucide-react';
import WeatherSection from './WeatherSection'; // Import your new component

const Dashboard = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData([
      { name: 'Jan', users: 45 }, { name: 'Feb', users: 52 },
      { name: 'Mar', users: 60 }, { name: 'Apr', users: 72 },
      { name: 'May', users: 85 }, { name: 'Jun', users: 95 },
      { name: 'Jul', users: 112 }, { name: 'Aug', users: 128 },
      { name: 'Sep', users: 145 }, { name: 'Oct', users: 162 },
      { name: 'Nov', users: 178 }, { name: 'Dec', users: 195 },
    ]);
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center">
        <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Dashboard</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
       
        <div className="lg:col-span-2 space-y-8">
          
         
          <div className="bg-[#4a89ff] rounded-[3rem] p-8 md:p-10 shadow-2xl overflow-hidden relative border border-white/10">
            <h3 className="text-white text-2xl font-semibold mb-8">Monthly User Analytics</h3>
            <div className="bg-white rounded-[2.5rem] p-6 h-[400px] shadow-inner">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 13}} dy={15} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 13}} dx={-10} />
                  <Tooltip 
                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="users" 
                    stroke="#17a34a" 
                    strokeWidth={5} 
                    dot={{ r: 7, fill: '#17a34a', strokeWidth: 3, stroke: '#fff' }}
                    activeDot={{ r: 9, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <StatCard label="Total Users" value="1,847" icon={<Users size={28}/>} color="bg-green-100 text-green-600" />
            <StatCard label="Pending Users" value="23" icon={<UserPlus size={28}/>} color="bg-blue-100 text-blue-600" />
          </div>
        </div>

     
        <div className="lg:col-span-1">
          <WeatherSection />
          
         
          <div className="mt-6">
             <StatCard label="Restricted" value="12" icon={<ShieldAlert size={28}/>} color="bg-red-100 text-red-600" />
          </div>
        </div>

      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon, color }) => (
  <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex justify-between items-center transition-all hover:shadow-md hover:-translate-y-1">
    <div>
      <p className="text-slate-500 font-medium mb-1">{label}</p>
      <p className="text-3xl font-black text-slate-800 tracking-tight">{value}</p>
    </div>
    <div className={`p-5 rounded-2xl ${color}`}>{icon}</div>
  </div>
);

export default Dashboard;
*/

/*
import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, UserPlus } from 'lucide-react';
import WeatherSection from './WeatherSection'; 

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingUsers: 0,
    location: "Pune, Maharashtra", // Updated to SuperAdmin Current Location
    temp: "20°C"
  });

  useEffect(() => {
    // 1. Fetch live data from your backend
    // Replace with your endpoint: http://localhost:5000/api/admin/users
    fetch('http://localhost:5000/api/admin/users?status=all')
      .then(res => res.json())
      .then(users => {
        calculateStats(users);
        processChartData(users);
      })
      .catch(() => {
        // Fallback Mock Data for demonstration
        const mockUsers = [
          { created_at: '2026-01-10', status: 'Active' },
          { created_at: '2026-01-20', status: 'Pending' },
          { created_at: '2026-02-05', status: 'Pending' },
          { created_at: '2026-02-15', status: 'Active' }
        ];
        calculateStats(mockUsers);
        processChartData(mockUsers);
      });
  }, []);

  const calculateStats = (users) => {
    const total = users.length;
    // Filter specifically for 'Pending' status as requested
    const pending = users.filter(u => u.status?.toLowerCase() === 'pending').length;
    
    setStats(prev => ({
      ...prev,
      totalUsers: total,
      pendingUsers: pending
    }));
  };

  const processChartData = (users) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    // Group users by month based on their registration (created_at) date
    const monthlyCounts = months.map((month, index) => {
      const count = users.filter(u => new Date(u.created_at).getMonth() === index).length;
      return { name: month, users: count };
    });
    
    setData(monthlyCounts);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center">
        <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Super Admin Dashboard</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        
        <div className="lg:col-span-2 space-y-8">
          
        
          <div className="bg-[#4a89ff] rounded-[3rem] p-8 md:p-10 shadow-2xl overflow-hidden relative border border-white/10">
            <h3 className="text-white text-2xl font-semibold mb-8">Monthly User Analytics</h3>
            <div className="bg-white rounded-[2.5rem] p-6 h-[400px] shadow-inner">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 13}} dy={15} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 13}} dx={-10} />
                  <Tooltip contentStyle={{borderRadius: '16px', border: 'none'}} />
                  <Line 
                    type="monotone" 
                    dataKey="users" 
                    stroke="#17a34a" 
                    strokeWidth={5} 
                    dot={{ r: 7, fill: '#17a34a', strokeWidth: 3, stroke: '#fff' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

         
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <StatCard 
               label="Total Registered Farmers" 
               value={stats.totalUsers.toLocaleString()} 
               icon={<Users size={28}/>} 
               color="bg-green-100 text-green-600" 
            />
            <StatCard 
               label="Users Awaiting Approval" 
               value={stats.pendingUsers.toLocaleString()} 
               icon={<UserPlus size={28}/>} 
               color="bg-amber-100 text-amber-600" 
            />
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="bg-green-600 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden">
             <div className="relative z-10">
                <p className="text-white/80 font-medium uppercase tracking-widest text-xs mb-2">Current Location</p>
                <h4 className="text-3xl font-black mb-1">{stats.location}</h4>
                <p className="text-5xl font-light">{stats.temp}</p>
                <div className="mt-6 inline-flex items-center px-4 py-2 bg-white/20 rounded-full backdrop-blur-md text-sm">
                   ☀️ Clear Sky
                </div>
             </div>
            
             <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full"></div>
          </div>
          
          <div className="p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm">
             <h4 className="font-bold text-slate-800 mb-2">System Status</h4>
             <p className="text-slate-500 text-sm">All services are running normally. Last sync: Just now.</p>
          </div>
        </div>

      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon, color }) => (
  <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex justify-between items-center transition-all hover:shadow-md">
    <div>
      <p className="text-slate-500 font-medium mb-1">{label}</p>
      <p className="text-4xl font-black text-slate-800 tracking-tight">{value}</p>
    </div>
    <div className={`p-5 rounded-2xl ${color}`}>{icon}</div>
  </div>
);

export default Dashboard;
*/

import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, UserPlus } from 'lucide-react';
import { supabase } from "../../lib/supabaseClient";// Ensure this path is correct
import WeatherSection from './WeatherSection'; 

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingUsers: 0,
    location: "Pune, Maharashtra", 
    temp: "20°C"
  });

  useEffect(() => {
    fetchLiveStats();
  }, []);

  const fetchLiveStats = async () => {
    setLoading(true);
    try {
      // 1. Fetch all profiles from Supabase
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('created_at, account_status');

      if (error) throw error;

      if (profiles) {
        calculateStats(profiles);
        processChartData(profiles);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error.message);
      // Fallback to empty state if fetch fails
      setStats(prev => ({ ...prev, totalUsers: 0, pendingUsers: 0 }));
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (users) => {
    const total = users.length;
    // Filter specifically for 'pending' status as defined in your SQL trigger
    const pending = users.filter(u => u.account_status?.toLowerCase() === 'pending').length;
    
    setStats(prev => ({
      ...prev,
      totalUsers: total,
      pendingUsers: pending
    }));
  };

  const processChartData = (users) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentYear = new Date().getFullYear();
    
    // Group users by month based on their registration (created_at) date
    const monthlyCounts = months.map((month, index) => {
      const count = users.filter(u => {
        const regDate = new Date(u.created_at);
        return regDate.getMonth() === index && regDate.getFullYear() === currentYear;
      }).length;
      return { name: month, users: count };
    });
    
    setData(monthlyCounts);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center">
        <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Super Admin Dashboard</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column (Analytics and Stats) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Monthly Analytics Card */}
          <div className="bg-[#4a89ff] rounded-[3rem] p-8 md:p-10 shadow-2xl overflow-hidden relative border border-white/10">
            <h3 className="text-white text-2xl font-semibold mb-8">Monthly User Analytics ({new Date().getFullYear()})</h3>
            <div className="bg-white rounded-[2.5rem] p-6 h-[400px] shadow-inner">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 13}} dy={15} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 13}} dx={-10} />
                  <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                  <Line 
                    type="monotone" 
                    dataKey="users" 
                    stroke="#17a34a" 
                    strokeWidth={5} 
                    dot={{ r: 7, fill: '#17a34a', strokeWidth: 3, stroke: '#fff' }}
                    activeDot={{ r: 9, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Stats Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <StatCard 
               label="Total Registered Farmers" 
               value={stats.totalUsers.toLocaleString()} 
               icon={<Users size={28}/>} 
               color="bg-green-100 text-green-600" 
            />
            <StatCard 
               label="Users Awaiting Approval" 
               value={stats.pendingUsers.toLocaleString()} 
               icon={<UserPlus size={28}/>} 
               color="bg-amber-100 text-amber-600" 
            />
          </div>
        </div>

        {/* Right Column (Location & Status) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-green-600 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden">
             <div className="relative z-10">
                <p className="text-white/80 font-medium uppercase tracking-widest text-xs mb-2">Current Location</p>
                <h4 className="text-3xl font-black mb-1">{stats.location}</h4>
                <p className="text-5xl font-light">{stats.temp}</p>
                <div className="mt-6 inline-flex items-center px-4 py-2 bg-white/20 rounded-full backdrop-blur-md text-sm">
                   ☀️ Clear Sky
                </div>
             </div>
             <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full"></div>
          </div>
          
          <div className="p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm">
             <h4 className="font-bold text-slate-800 mb-2">System Status</h4>
             <p className="text-slate-500 text-sm">Database synced with profiles. Last refresh: Just now.</p>
          </div>

          {/* Replaced Restricted section with a WeatherSection helper if it exists */}
          <WeatherSection />
        </div>

      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon, color }) => (
  <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex justify-between items-center transition-all hover:shadow-md hover:-translate-y-1">
    <div>
      <p className="text-slate-500 font-medium mb-1">{label}</p>
      <p className="text-4xl font-black text-slate-800 tracking-tight">{value}</p>
    </div>
    <div className={`p-5 rounded-2xl ${color}`}>{icon}</div>
  </div>
);

export default Dashboard;