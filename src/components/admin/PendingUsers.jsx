

import React, { useState, useEffect } from 'react';
import { Check, X, Loader2, RefreshCw } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

const PendingUsers = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    setLoading(true);
    try {
      // Fetch only users where account_status is 'pending'
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, created_at')
        .eq('account_status', 'pending')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setPendingUsers(data || []);
    } catch (error) {
      console.error("Error fetching pending users:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (userId, newStatus) => {
    setProcessingId(userId);
    try {
      // 1. Update the record in the Supabase 'profiles' table
      const { error } = await supabase
        .from('profiles')
        .update({ account_status: newStatus })
        .eq('id', userId);

      if (error) throw error;

      // 2. Remove the user from the local state so they disappear from the list immediately
      setPendingUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      
      console.log(`User ${userId} successfully moved to ${newStatus}`);
    } catch (error) {
      alert("Error updating status: " + error.message);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="w-10 h-10 text-green-600 animate-spin mb-4" />
        <p className="text-slate-500 animate-pulse">Checking for new farmer requests...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Pending Approval</h2>
          <p className="text-slate-500 text-sm mt-1">Review new registrations for AgriSetu access</p>
        </div>
        <button 
          onClick={fetchPendingUsers}
          className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-green-600 hover:shadow-md transition-all"
        >
          <RefreshCw size={20} />
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr className="text-slate-400 text-[10px] uppercase tracking-[0.2em] font-black">
                <th className="px-8 py-6">Farmer ID</th>
                <th className="px-8 py-6">Name</th>
                <th className="px-8 py-6">Email</th>
                <th className="px-8 py-6">Applied Date</th>
                <th className="px-8 py-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {pendingUsers.length > 0 ? (
                pendingUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6 text-slate-400 font-mono text-xs">
                      {user.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="px-8 py-6 text-slate-900 font-bold group-hover:text-green-700 transition-colors">
                      {user.full_name || "New User"}
                    </td>
                    <td className="px-8 py-6 text-slate-500">{user.email}</td>
                    <td className="px-8 py-6 text-slate-400 text-sm italic">
                      {new Date(user.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-center gap-4">
                        {processingId === user.id ? (
                          <Loader2 className="w-6 h-6 animate-spin text-green-500" />
                        ) : (
                          <>
                            <button 
                              onClick={() => handleStatusUpdate(user.id, 'active')}
                              className="p-3 bg-green-50 text-green-600 rounded-2xl hover:bg-green-600 hover:text-white transition-all shadow-sm hover:shadow-green-200"
                              title="Approve & Grant Access"
                            >
                              <Check size={20} strokeWidth={3} />
                            </button>
                            <button 
                              onClick={() => handleStatusUpdate(user.id, 'rejected')}
                              className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                              title="Reject Request"
                            >
                              <X size={20} strokeWidth={3} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-8 py-24 text-center">
                    <div className="flex flex-col items-center opacity-40">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                        <Check size={32} />
                      </div>
                      <p className="text-slate-600 font-bold text-lg">Queue Clear!</p>
                      <p className="text-slate-400 text-sm">No pending farmer registrations to review.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PendingUsers;