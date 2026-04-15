/*
import React, { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';

const AllUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Replace with your actual backend endpoint: http://localhost:5000/api/admin/all-users
    fetch('http://localhost:5000/api/admin/users?status=all')
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(() => {
        setUsers([
          { id: 'U0001', name: 'Arjun Reddy', email: 'arjun.reddy@email.com', role: 'Farmer', status: 'Active' },
          { id: 'U0002', name: 'Meera Nair', email: 'meera.nair@email.com', role: 'Farmer', status: 'Active' },
          { id: 'U0007', name: 'Suresh Babu', email: 'suresh.babu@email.com', role: 'Buyer', status: 'Restricted' },
        ]);
      });
  }, []);

  return (
    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-8 border-b border-slate-50">
        <h2 className="text-2xl font-bold text-slate-800">All Users</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 text-slate-400 text-xs uppercase tracking-widest">
              <th className="px-8 py-5 font-semibold">User ID</th>
              <th className="px-8 py-5 font-semibold">Name</th>
              <th className="px-8 py-5 font-semibold">Email</th>
              <th className="px-8 py-5 font-semibold">Role</th>
              <th className="px-8 py-5 font-semibold">Account Status</th>
              <th className="px-8 py-5 font-semibold text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="px-8 py-5 text-slate-500 font-medium">{user.id}</td>
                <td className="px-8 py-5 font-semibold text-slate-800">{user.name}</td>
                <td className="px-8 py-5 text-slate-500">{user.email}</td>
                <td className="px-8 py-5 text-slate-600">{user.role}</td>
                <td className="px-8 py-5">
                  <span className={`px-4 py-1 rounded-full text-[11px] font-bold uppercase ${
                    user.status === 'Active' ? 'bg-green-100 text-green-600' : 
                    user.status === 'Restricted' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-8 py-5 text-center">
                  <button className="p-2.5 bg-blue-50 text-blue-500 rounded-xl hover:bg-blue-100 transition shadow-sm">
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllUsers;
*/



import React, { useState, useEffect } from 'react';
import { Eye, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient'; // Ensure this path is correct

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    setLoading(true);
    try {
      // Fetching from the profiles table synced with auth.users
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, role, account_status')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform data for the table display
      const formattedUsers = data.map(user => ({
        id: user.id.slice(0, 8).toUpperCase(), // Shortened ID for clean UI
        name: user.full_name || user.email.split('@')[0], // Fallback to email prefix if name is missing
        email: user.email,
        role: user.role || 'Farmer',
        status: user.account_status || 'Pending'
      }));

      setUsers(formattedUsers);
    } catch (error) {
      console.error("Error fetching users:", error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Loader2 className="w-10 h-10 text-green-600 animate-spin" />
        <p className="text-slate-500 font-medium">Fetching registered users...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden animate-in fade-in duration-500">
      <div className="p-8 border-b border-slate-50 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">All Users</h2>
          <p className="text-sm text-slate-500 mt-1">Total dynamic records: {users.length}</p>
        </div>
        <button 
          onClick={fetchAllUsers}
          className="text-xs font-bold text-green-600 hover:text-green-700 uppercase tracking-widest"
        >
          Refresh List
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 text-slate-400 text-xs uppercase tracking-widest font-bold">
              <th className="px-8 py-6">User ID</th>
              <th className="px-8 py-6">Name</th>
              <th className="px-8 py-6">Email</th>
              <th className="px-8 py-6">Role</th>
              <th className="px-8 py-6">Account Status</th>
              <th className="px-8 py-6 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-8 py-5 text-slate-400 font-mono text-xs">{user.id}</td>
                  <td className="px-8 py-5 font-bold text-slate-800">{user.name}</td>
                  <td className="px-8 py-5 text-slate-500">{user.email}</td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter ${
                      user.role === 'super admin' ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider ${
                      user.status.toLowerCase() === 'active' ? 'bg-green-100 text-green-600' : 
                      user.status.toLowerCase() === 'pending' ? 'bg-amber-100 text-amber-600' : 
                      'bg-red-100 text-red-600'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <button className="p-2.5 bg-blue-50 text-blue-500 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-8 py-20 text-center text-slate-400 font-medium">
                  No users found in the database.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllUsers;