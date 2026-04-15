import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, CloudSun, MessageSquare, User, Activity } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // This function checks which page is currently open to highlight the icon
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 flex justify-between items-center z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      
      {/* Home Button */}
      <button 
        onClick={() => navigate('/farmer-dashboard')}
        className={`flex flex-col items-center gap-1 transition-colors ${isActive('/farmer-dashboard') ? 'text-green-600' : 'text-slate-400'}`}
      >
        <Home size={22} strokeWidth={isActive('/farmer-dashboard') ? 2.5 : 2} />
        <span className="text-[10px] font-bold">मुख्य (Home)</span>
      </button>

      {/* Weather Button - The one we just built */}
      <button 
        onClick={() => navigate('/weather')}
        className={`flex flex-col items-center gap-1 transition-colors ${isActive('/weather') ? 'text-green-600' : 'text-slate-400'}`}
      >
        <CloudSun size={22} strokeWidth={isActive('/weather') ? 2.5 : 2} />
        <span className="text-[10px] font-bold">हवामान (Weather)</span>
      </button>

      {/* AI Assistant Button */}
      <button 
        onClick={() => navigate('/ai-assistant')}
        className={`flex flex-col items-center gap-1 transition-colors ${isActive('/ai-assistant') ? 'text-green-600' : 'text-slate-400'}`}
      >
        <MessageSquare size={22} strokeWidth={isActive('/ai-assistant') ? 2.5 : 2} />
        <span className="text-[10px] font-bold">मदत (AI)</span>
      </button>

      {/* Krushi Doctor Button */}
      <button 
        onClick={() => navigate('/krushi-doctor')}
        className={`flex flex-col items-center gap-1 transition-colors ${isActive('/krushi-doctor') ? 'text-green-600' : 'text-slate-400'}`}
      >
        <Activity size={22} strokeWidth={isActive('/krushi-doctor') ? 2.5 : 2} />
        <span className="text-[10px] font-bold">डॉक्टर</span>
      </button>

    </nav>
  );
};

export default Navbar;