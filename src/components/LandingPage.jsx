

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { 
  Search, Mic, Cloud, Bell, Twitter, Facebook, Youtube, Github, Linkedin,
  HelpCircle, Brain, Lightbulb, TrendingUp as TrendingUpIcon,
  Sprout, CloudSun, Stethoscope, FlaskConical, Settings, 
  ArrowRight, Sparkles, Leaf, Mail
} from 'lucide-react';

function LandingPage() {
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Error fetching session:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

  const handleUserSelect = (userType) => {
    if (userType === 'farmer') {
      navigate('/farmer-login');
    } else if (userType === 'admin') {
      navigate('/admin-login');
    }
  };

  const handleDashboardNavigation = () => {
    if (!user) return;
    const metadata = user.user_metadata || {};
    if (metadata.role === 'super admin') {
      navigate('/admin'); 
    } else {
      navigate('/farmer-dashboard'); 
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (showLogin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-8">Select User Type</h2>
          <div className="flex justify-around mb-8">
            <div className="flex flex-col items-center group cursor-pointer" onClick={() => handleUserSelect('farmer')}>
              <div className="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center transition-all duration-300 group-hover:bg-green-600 group-hover:scale-110">
                <span className="text-4xl">🧑‍🌾</span>
              </div>
              <p className="mt-3 font-semibold text-gray-700 group-hover:text-green-600">Farmer</p>
            </div>
            <div className="flex flex-col items-center group cursor-pointer" onClick={() => handleUserSelect('admin')}>
              <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center transition-all duration-300 group-hover:bg-blue-600 group-hover:scale-110">
                <span className="text-4xl">🧑‍💻</span>
              </div>
              <p className="mt-3 font-semibold text-gray-700 group-hover:text-blue-600">Admin</p>
            </div>
          </div>
          <button onClick={() => setShowLogin(false)} className="text-sm text-gray-400 hover:text-gray-600 underline">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-200">
                <div className="w-5 h-5 bg-white rounded-full opacity-90 animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-2xl font-black text-gray-900 leading-none">AgriSetu</h1>
                <p className="text-[10px] uppercase tracking-widest text-green-600 font-bold">Smart Farming</p>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-green-600 font-bold border-b-2 border-green-600 pb-1">Home</a>
              <a href="#" className="text-gray-500 hover:text-green-600 font-medium transition-colors">Features</a>
              <a href="#" className="text-gray-500 hover:text-green-600 font-medium transition-colors">About Us</a>
              {user && (
                <button onClick={handleLogout} className="text-red-500 hover:text-red-600 font-bold px-4 py-2 rounded-lg hover:bg-red-50 transition-colors">
                  Logout
                </button>
              )}
            </nav>

            <div className="bg-gray-100 p-2.5 rounded-xl cursor-pointer hover:bg-gray-200 transition-colors">
              <Search className="w-5 h-5 text-gray-600" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Wrapper */}
      <div className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-[90vh] flex items-center overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-10000 hover:scale-110"
            style={{ backgroundImage: `url('https://images.pexels.com/photos/2132180/pexels-photo-2132180.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-900/90 via-green-800/60 to-transparent"></div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-2xl space-y-8">
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                </span>
                <p className="text-xs font-bold text-yellow-200 uppercase tracking-widest">New: AI Weather Insights</p>
              </div>
              
              <h1 className="text-6xl md:text-7xl font-black text-white leading-tight">
                Empowering <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-green-300">Intelligent</span> <br />
                Agriculture
              </h1>
              
              <p className="text-xl text-white/80 max-w-lg leading-relaxed font-medium border-l-4 border-green-500 pl-6">
                Bridging the gap between traditional wisdom and modern technology for sustainable yields.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                {user ? (
                  <button 
                    onClick={handleDashboardNavigation}
                    className="bg-white text-green-800 font-black px-10 py-5 rounded-2xl hover:bg-green-50 transition-all transform hover:-translate-y-1 shadow-2xl flex items-center justify-center gap-3"
                  >
                    Go to Dashboard
                    <TrendingUpIcon className="w-5 h-5" />
                  </button>
                ) : (
                  <button 
                    onClick={() => setShowLogin(true)}
                    className="bg-green-600 text-white font-black px-10 py-5 rounded-2xl hover:bg-green-500 transition-all transform hover:-translate-y-1 shadow-2xl shadow-green-900/40"
                  >
                    Get Started
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Solutions Section */}
        <section className="py-24 bg-gray-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-4xl font-black text-gray-900 mb-6">Complete Farming Solutions</h2>
              <p className="text-gray-500 font-medium">From seed to harvest, AgriSetu AI provides comprehensive support.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <SolutionCard icon={<Sprout />} title="Crop Advisory" desc="Cultivation guidance for all seasons." colorTheme="green" />
              <SolutionCard icon={<CloudSun />} title="Weather Updates" desc="Hyperlocal weather forecasts." colorTheme="blue" />
              <SolutionCard icon={<Stethoscope />} title="Krushi Doctor" desc="Pest and disease diagnosis." colorTheme="red" />
              <SolutionCard icon={<FlaskConical />} title="Soil Health" desc="Soil testing and fertilizer advice." colorTheme="amber" />
              <SolutionCard icon={<Mic />} title="Voice Support" desc="Assistance in Marathi and Hindi." colorTheme="indigo" />
              <SolutionCard icon={<Settings />} title="Equipment" desc="Smart farming tools and machinery." colorTheme="slate" />
            </div>
          </div>
        </section>
      </div>

      {/* NEW DARK FOOTER */}
      <footer className="bg-[#0B1120] text-slate-400 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            
            {/* Column 1: Brand */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="bg-green-600 p-2 rounded-xl">
                  <Leaf className="text-white" size={24} />
                </div>
                <span className="text-2xl font-black text-white tracking-tight">AgriSetu</span>
              </div>
              <p className="text-sm leading-relaxed font-medium opacity-80">
                AI-powered plant disease detection for healthier crops and better yields. Empowering Indian farmers with technology.
              </p>
              <div className="flex gap-4">
                <a href="#" className="hover:text-green-500 transition-colors"><Twitter size={20} /></a>
                <a href="#" className="hover:text-green-500 transition-colors"><Facebook size={20} /></a>
                <a href="#" className="hover:text-green-500 transition-colors"><Youtube size={20} /></a>
                <a href="#" className="hover:text-green-500 transition-colors"><Github size={20} /></a>
              </div>
            </div>

            {/* Column 2: Product */}
            <div className="space-y-6">
              <h4 className="text-white font-black uppercase text-xs tracking-[0.2em]">Product</h4>
              <ul className="space-y-4 text-sm font-bold">
                <li><a href="#" className="hover:text-green-500 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-green-500 transition-colors">How It Works</a></li>
                <li><a href="#" className="hover:text-green-500 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-green-500 transition-colors">API</a></li>
              </ul>
            </div>

            {/* Column 3: Company */}
            <div className="space-y-6">
              <h4 className="text-white font-black uppercase text-xs tracking-[0.2em]">Company</h4>
              <ul className="space-y-4 text-sm font-bold">
                <li><a href="#" className="hover:text-green-500 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-green-500 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-green-500 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-green-500 transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Column 4: Legal */}
            <div className="space-y-6">
              <h4 className="text-white font-black uppercase text-xs tracking-[0.2em]">Legal</h4>
              <ul className="space-y-4 text-sm font-bold">
                <li><a href="#" className="hover:text-green-500 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-green-500 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-green-500 transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-40">
              © {new Date().getFullYear()} AgriSetu. Built for sustainable farming.
            </p>
            <div className="flex items-center gap-2 text-xs font-bold opacity-40">
              <Mail size={14} /> support@agrisetu.in
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

const SolutionCard = ({ icon, title, desc, colorTheme }) => {
  const themes = {
    green: { bg: 'hover:bg-green-600', text: 'text-green-600', iconBg: 'bg-green-50' },
    blue: { bg: 'hover:bg-blue-600', text: 'text-blue-600', iconBg: 'bg-blue-50' },
    red: { bg: 'hover:bg-red-500', text: 'text-red-500', iconBg: 'bg-red-50' },
    amber: { bg: 'hover:bg-amber-500', text: 'text-amber-600', iconBg: 'bg-amber-50' },
    indigo: { bg: 'hover:bg-indigo-600', text: 'text-indigo-600', iconBg: 'bg-indigo-50' },
    slate: { bg: 'hover:bg-slate-700', text: 'text-slate-600', iconBg: 'bg-slate-100' },
  };
  const activeTheme = themes[colorTheme] || themes.green;

  return (
    <div className={`p-10 rounded-[2.5rem] border border-slate-100 bg-white transition-all duration-500 group cursor-pointer shadow-sm hover:shadow-2xl hover:-translate-y-2 ${activeTheme.bg} hover:text-white`}>
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-all duration-500 ${activeTheme.iconBg} ${activeTheme.text} group-hover:bg-white/20 group-hover:text-white`}>
        {React.cloneElement(icon, { size: 32 })}
      </div>
      <h3 className="text-xl font-black mb-4 leading-tight">{title}</h3>
      <p className="text-sm font-medium leading-relaxed opacity-80">{desc}</p>
    </div>
  );
};

export default LandingPage;