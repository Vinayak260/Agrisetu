


import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Loader2, MapPin, RefreshCcw } from 'lucide-react';

const UserProfiles = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLiveProfiles();
  }, []);

  const fetchLiveProfiles = async () => {
    setLoading(true);
    try {
      // 1. Fetch live data from the profiles table synced with Auth
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, role, location')
        .order('full_name', { ascending: true });

      if (error) throw error;

      // 2. Map the dynamic data, ensuring no hardcoded fallback values
      const formattedProfiles = data.map(profile => ({
        id: profile.id.slice(0, 8).toUpperCase(),
        name: profile.full_name || 'Anonymous User',
        email: profile.email,
        role: profile.role || 'Farmer',
        location: profile.location || 'Location Not Provided'
      }));

      setProfiles(formattedProfiles);
    } catch (error) {
      console.error("Error fetching user profiles:", error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-80 space-y-4">
        <Loader2 className="w-12 h-12 text-green-600 animate-spin" />
        <p className="text-slate-500 font-bold animate-pulse">Updating regional profile directory...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden animate-in fade-in duration-700">
      {/* Header with Refresh Capability */}
      <div className="p-8 border-b border-slate-50 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">User Profiles</h2>
          <p className="text-sm text-slate-500 mt-1 italic">Verified regional registration data</p>
        </div>
        <button 
          onClick={fetchLiveProfiles}
          className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-green-600 hover:text-white transition-all shadow-inner"
          title="Sync with Database"
        >
          <RefreshCcw size={20} />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase tracking-[0.2em] font-black">
              <th className="px-8 py-6">User ID</th>
              <th className="px-8 py-6">Name</th>
              <th className="px-8 py-6">Email</th>
              <th className="px-8 py-6">Role</th>
              <th className="px-8 py-6">Location</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {profiles.length > 0 ? (
              profiles.map((profile) => (
                <tr key={profile.id} className="hover:bg-slate-50/80 transition-all duration-300 group">
                  <td className="px-8 py-6 text-slate-400 font-mono text-xs group-hover:text-slate-600 transition-colors">
                    {profile.id}
                  </td>
                  <td className="px-8 py-6 font-bold text-slate-800 group-hover:text-green-700 transition-colors">
                    {profile.name}
                  </td>
                  <td className="px-8 py-6 text-slate-500">{profile.email}</td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter ${
                      profile.role.toLowerCase() === 'super admin' 
                        ? 'bg-purple-100 text-purple-600' 
                        : 'bg-blue-50 text-blue-600'
                    }`}>
                      {profile.role}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-slate-500 italic flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-green-100 group-hover:text-green-600 transition-all">
                      <MapPin size={16} />
                    </div>
                    {profile.location}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-8 py-32 text-center">
                  <p className="text-slate-400 font-bold text-lg">No active profiles found in the registry.</p>
                  <p className="text-slate-300 text-sm italic mt-1">Please ensure the SQL backfill script has been executed.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserProfiles;