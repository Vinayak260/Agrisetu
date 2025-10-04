
import React, { useState, useEffect } from 'react';
 import { useNavigate, Link } from 'react-router-dom';
 import { supabase } from '../lib/supabaseClient';
 import { Search, Mic, Cloud, Bell, MessageSquare, Settings, Smartphone, Users, TrendingUp, Twitter, Facebook, Youtube } from 'lucide-react';
// Importing icons for the "How it works?" section
import { HelpCircle, Brain, Lightbulb, TrendingUp as TrendingUpIcon } from 'lucide-react';


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
                <span className="text-3xl">🧑‍🌾</span>
              </div>
              <p className="mt-2 text-gray-700">Farmer</p>
            </div>
            <div className="flex flex-col items-center cursor-pointer" onClick={() => handleUserSelect('admin')}>
              <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center transition-colors duration-200 hover:bg-purple-100">
                <span className="text-3xl">🧑‍💻</span>
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

      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-r from-green-800/80 to-green-600/80">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiscUSeaWqCggUmsv9TDkabulCiGyGrNLlOyOl4jDfnCkntDVexxK4YjE0d1QHOoBo5GLVYm5RHsZQITiu446lT0VMmOfhjwbJ1W_3DQcvu7Mb80aPjJR6dFnvUGZgoGJs3HLaGbjZQqOzYjAe0lhNs9Hpmt8QESIwfDo2EhCmzldABwX_8J1KlAkyRqQ/s574/istockphoto-506164764-170667a.jpg')`, // Updated background image URL
            backgroundBlendMode: 'overlay'
          }}
        ></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[70vh]">
            <div className="text-white space-y-6">
              <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                <p className="text-sm font-medium text-yellow-200">AgriSetu Offers</p>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-white drop-shadow-lg">Empowering Farmers</span>
                <br />
               <span className="text-yellow-300 drop-shadow-lg">with Intelligent</span>
                <br />
               <span className="text-green-300 drop-shadow-lg">Technology</span>
              </h1>
              
              <p className="text-xl text-white/90 drop-shadow-md font-medium">
                Weather conditions and guidance
              </p>
              
              {user ? (
                <div className="space-y-2">
                  <p className="text-white/90">Welcome back! You're already connected.</p>
                  <button 
                    onClick={() => navigate('/dashboard')}
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold px-8 py-4 rounded-lg hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 shadow-lg"
                  >
                    Go to Dashboard
                  </button>
                </div>
              ) : (
                <button 
                  onClick={handleGetStarted}
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold px-8 py-4 rounded-lg hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 shadow-lg"
                >
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
              <p className="text-gray-600">
                Breaking rural and urban barriers through multilingual voice guidance and recommendations.
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                <Cloud className="w-8 h-8 text-white" />
              </div>
              <Link to="/feature-weather" className="text-xl font-semibold text-gray-800 hover:text-green-600 transition-colors">
                Real-Time Weather Updates & Alerts
              </Link>
              <p className="text-gray-600">
                AI-driven crop advisory ensuring timely and actionable weather data you need.
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                <Bell className="w-8 h-8 text-white" />
              </div>
              <Link to="/feature-crop" className="text-xl font-semibold text-gray-800 hover:text-green-600 transition-colors">
                Real-Time Crop Updates & Soil Insights
              </Link>
              <p className="text-gray-600">
                Making farming easier with AI alerts and insights.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section className="py-20 bg-green-50"> {/* Using a light green background for this section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-green-800 mb-12">How it works?</h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            {/* Step 1: Ask a Question */}
            <div className="bg-white p-6 rounded-xl shadow-lg text-center space-y-4 border-t-4 border-green-600">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto border-2 border-green-600">
                <HelpCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Ask a Question</h3>
              <p className="text-gray-600">
                Farmers enter a query via app, call, or chatbot.
              </p>
            </div>
            
            {/* Step 2: AI Analyzes Data */}
            <div className="bg-white p-6 rounded-xl shadow-lg text-center space-y-4 border-t-4 border-green-600">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto border-2 border-green-600">
                <Brain className="w-8 h-8 text-green-600" /> {/* Using Brain for AI analysis */}
              </div>
              <h3 className="text-xl font-semibold text-gray-800">AI Analyzes Data</h3>
              <p className="text-gray-600">
                Ekta.AI checks weather, soil, and market conditions.
              </p>
            </div>
            
            {/* Step 3: Personalized Advice */}
            <div className="bg-white p-6 rounded-xl shadow-lg text-center space-y-4 border-t-4 border-green-600">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto border-2 border-green-600">
                <Lightbulb className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Personalized Advice</h3>
              <p className="text-gray-600">
                Farmers receive clear actionable insights.
              </p>
            </div>
            
            {/* Step 4: Better Decisions */}
            <div className="bg-white p-6 rounded-xl shadow-lg text-center space-y-4 border-t-4 border-green-600">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto border-2 border-green-600">
                <TrendingUpIcon className="w-8 h-8 text-green-600" /> {/* Using TrendingUpIcon for better decisions */}
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Better Decisions</h3>
              <p className="text-gray-600">
                Higher yield, improved income, and sustainability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full overflow-hidden">
                <img 
                  src="https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=100" 
                  alt="Team member" 
                  className="w-full h-full object-cover"
                />
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