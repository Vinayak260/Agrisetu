// import React from 'react';

//      function LandingPage() {
//        return (
//          <div className="min-h-screen relative">
//            <div 
//              className="absolute inset-0 bg-cover bg-center"
//              style={{ backgroundImage: "url('https://images.pexels.com/photos/1595104/pexels-photo-1595104.jpeg?auto=compress&cs=tinysrgb&w=1600')" }}
//            ></div>
//            <div className="absolute inset-0 bg-gradient-to-b from-darkgreen via-seagreen to-transparent"></div>
//            <div className="relative min-h-screen flex items-center justify-center">
//              <div className="text-center text-white p-6">
//                <h1 className="text-5xl font-bold mb-4">Welcome to AgriSetu</h1>
//                <p className="text-xl mb-6">Empowering farmers with modern solutions.</p>
//                <div className="space-x-4">
//                  <a href="/farmer-login" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Farmer Login</a>
//                  <a href="/admin-login" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Admin Login</a>
//                </div>
//              </div>
//            </div>
//          </div>
//        );
//      }

//      export default LandingPage;
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Search, Mic, Cloud, Bell, MessageSquare, Settings, Smartphone, Users, TrendingUp, Twitter, Facebook, Youtube } from 'lucide-react';

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

  const handleGetStarted = () => {
    setShowLogin(true);
  };

  const handleUserSelect = (userType) => {
    if (userType === 'farmer') {
      navigate('/farmer-login');
    } else if (userType === 'admin') {
      navigate('/admin-login');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-100">Loading...</div>;
  }

  if (showLogin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Select User</h2>
          <div className="flex justify-around mb-6">
            <div className="flex flex-col items-center cursor-pointer" onClick={() => handleUserSelect('farmer')}>
              <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center transition-colors duration-200 hover:bg-green-100">
                <span className="text-3xl">🌱</span>
              </div>
              <p className="mt-2 text-gray-700">Farmer</p>
            </div>
            <div className="flex flex-col items-center cursor-pointer" onClick={() => handleUserSelect('admin')}>
              <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center transition-colors duration-200 hover:bg-purple-100">
                <span className="text-3xl">👨‍💼</span>
              </div>
              <p className="mt-2 text-gray-700">Admin</p>
            </div>
          </div>
          <button onClick={() => setShowLogin(false)} className="text-sm text-gray-500 underline">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-full opacity-80"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">AgriSetu</h1>
                <p className="text-xs text-gray-600">Bridge between farmers and technology</p>
              </div>
            </div>
            <nav className="hidden md:flex space-x-8">
              {user ? (
                <>
                  <span className="text-green-600 font-semibold border-b-2 border-green-600 pb-1">
                    Welcome, {user.email}
                  </span>
                  <button onClick={handleLogout} className="text-red-600 hover:text-red-700 transition-colors">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <a href="#" className="text-green-600 font-semibold border-b-2 border-green-600 pb-1">Home</a>
                  <a href="#" className="text-gray-700 hover:text-green-600 transition-colors">Features</a>
                  <a href="#" className="text-gray-700 hover:text-green-600 transition-colors">About Us</a>
                  <a href="#" className="text-gray-700 hover:text-green-600 transition-colors">Services</a>
                  <a href="#" className="text-gray-700 hover:text-green-600 transition-colors">Contact</a>
                </>
              )}
            </nav>
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="bg-green-600 p-2 rounded-md">
                  <Search className="w-5 h-5 text-white" />
                </div>
                <button onClick={handleLogout} className="text-sm text-red-600 hover:text-red-700">
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="bg-green-600 p-2 rounded-md">
                <Search className="w-5 h-5 text-white" />
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section with Updated Overlay */}
      <section className="relative min-h-screen">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.pexels.com/photos/1595104/pexels-photo-1595104.jpeg?auto=compress&cs=tinysrgb&w=1600')`,
          }}
        ></div>
        <div 
          className="absolute inset-0 bg-gradient-to-r from-[#2F4F4F] via-[#3CB371]/80 to-[#2F4F4F]/80"
        ></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[70vh]">
            <div className="text-white space-y-6">
              <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                <p className="text-sm font-medium text-yellow-200">AgriSetu Offers</p>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-white drop-shadow-lg">Empowering Farmers</span><br />
                <span className="text-yellow-300 drop-shadow-lg">with Intelligent</span><br />
                <span className="text-green-300 drop-shadow-lg">Technology</span>
              </h1>
              <p className="text-xl text-white/90 drop-shadow-md font-medium">Weather conditions and guidance</p>
              {user ? (
                <div className="space-y-2">
                  <p className="text-white/90">Welcome back! You're already connected.</p>
                  <button onClick={() => navigate('/dashboard')} className="bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold px-8 py-4 rounded-lg hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 shadow-lg">
                    Go to Dashboard
                  </button>
                </div>
              ) : (
                <button onClick={handleGetStarted} className="bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold px-8 py-4 rounded-lg hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 shadow-lg">
                  Get Started
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold text-gray-800">What AgriSetu Offers</h2>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <div className="w-6 h-6 bg-green-500 rounded-full"></div>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                <Mic className="w-8 h-8 text-white" />
              </div>
              <Link to="/feature-voice" className="text-xl font-semibold text-gray-800 hover:text-green-600 transition-colors">
                Multilingual Voice-Based Farming Advisory
              </Link>
              <p className="text-gray-600">Breaking rural and urban barriers through multilingual voice guidance and recommendations.</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                <Cloud className="w-8 h-8 text-white" />
              </div>
              <Link to="/feature-weather" className="text-xl font-semibold text-gray-800 hover:text-green-600 transition-colors">
                Real-Time Weather Updates & Alerts
              </Link>
              <p className="text-gray-600">AI-driven crop advisory ensuring timely and actionable weather data you need.</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                <Bell className="w-8 h-8 text-white" />
              </div>
              <Link to="/feature-crop" className="text-xl font-semibold text-gray-800 hover:text-green-600 transition-colors">
                Real-Time Crop Updates & Soil Insights
              </Link>
              <p className="text-gray-600">Making farming easier with AI alerts and insights.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-green-600 via-green-500 to-green-700 relative overflow-hidden">
        <div className="absolute top-10 right-10 opacity-20"><div className="w-32 h-32 bg-white rounded-full"></div></div>
        <div className="absolute bottom-10 left-10 opacity-20"><div className="w-24 h-24 bg-white rounded-full"></div></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <h2 className="text-4xl font-bold text-white mb-12">Our Real Impact</h2>
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center text-white space-y-4">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto">
                <MessageSquare className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold">Speak Your Query</h3>
            </div>
            <div className="text-center text-white space-y-4">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto">
                <Settings className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold">AI Processes Data</h3>
            </div>
            <div className="text-center text-white space-y-4">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto">
                <Smartphone className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold">Receive Instant Guidance</h3>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="flex items-center space-x-4 text-white">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex-shrink-0">
                <img src="https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=100" alt="Farmer" className="w-full h-full rounded-full object-cover" />
              </div>
              <div>
                <p className="text-2xl font-bold">500,000+ <span className="text-green-200">Farmers Connected</span></p>
                <p className="text-green-100">Connected, find increase solutions and optimal results.</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-white">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex-shrink-0">
                <img src="https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=100" alt="Farmer" className="w-full h-full rounded-full object-cover" />
              </div>
              <div>
                <p className="text-2xl font-bold">12,000+ <span className="text-green-200">Increased Yield</span></p>
                <p className="text-green-100">Supported yield improvement</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full overflow-hidden">
                <img src="https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=100" alt="Team member" className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Our Mission</h3>
                <p className="text-gray-600">Digital Vision Status</p>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-6">
              <div className="text-right">
                <p className="text-gray-600 text-sm">Terms & Conditions</p>
                <p className="text-gray-600 text-sm">Privacy Policy</p>
              </div>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center hover:bg-gray-400 transition-colors">
                  <Twitter className="w-5 h-5 text-gray-600" />
                </div>
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center hover:bg-gray-400 transition-colors">
                  <Facebook className="w-5 h-5 text-gray-600" />
                </div>
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center hover:bg-gray-400 transition-colors">
                  <Youtube className="w-5 h-5 text-gray-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;