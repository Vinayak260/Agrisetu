import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, UserCheck, UserPlus, 
  MessageSquare, BarChart3, LogOut, Menu, X 
} from 'lucide-react';

const AdminLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { path: '/admin', icon: <LayoutDashboard size={20}/>, label: 'Dashboard', end: true },
    { path: '/admin/pending', icon: <UserPlus size={20}/>, label: 'Pending Users' },
    { path: '/admin/all-users', icon: <Users size={20}/>, label: 'All Users' },
    { path: '/admin/profiles', icon: <UserCheck size={20}/>, label: 'User Profiles' },
    { path: '/admin/feedback', icon: <MessageSquare size={20}/>, label: 'Feedback' },
    { path: '/admin/analytics', icon: <BarChart3 size={20}/>, label: 'Feedback Analytics' },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Sidebar for Desktop */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-[#17a34a] text-white p-6 flex flex-col transition-transform duration-300
        md:relative md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="mb-10 px-2">
          <h1 className="text-3xl font-bold tracking-tight">AgriSetu</h1>
          <p className="text-sm opacity-80 uppercase tracking-widest mt-1">Admin Dashboard</p>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-4 p-3.5 rounded-2xl transition-all duration-200
                ${isActive ? 'bg-white text-[#17a34a] font-bold shadow-lg' : 'hover:bg-green-700/50 text-white/90'}
              `}
            >
              {item.icon}
              <span className="text-[15px]">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <button 
          onClick={() => navigate('/admin-login')}
          className="flex items-center gap-4 p-4 mt-auto hover:bg-red-500/20 rounded-2xl transition text-white/90 border border-transparent hover:border-white/20"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pt-16 md:pt-0 relative">
        {/* Mobile Header */}
        <div className="md:hidden absolute top-0 w-full p-4 flex justify-between items-center bg-[#17a34a] text-white z-40">
          <h1 className="text-xl font-bold">AgriSetu</h1>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        <div className="p-6 md:p-10 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;