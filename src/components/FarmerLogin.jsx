
/*
import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

function FarmerLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithPassword({ 
        email: username, // Assuming username is the email
        password 
      });

      if (error) {
        setError(error.message);
      } else {
        // ✅ SUCCESS: Redirect specifically to the Farmer Dashboard
        navigate('/farmer-dashboard');
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
   
      <div>
        <label className="block text-gray-700 font-medium mb-1 text-sm">Username/Email</label>
        <input
          type="email"
          className="w-full p-2.5 border rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your email"
          required
        />
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-1 text-sm">Password</label>
        <input
          type="password"
          className="w-full p-2.5 border rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />
      </div>

    
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-md text-xs animate-pulse">
          {error}
        </div>
      )}

    
      <button
        type="submit"
        disabled={loading}
        className={`w-full bg-green-600 text-white py-2.5 rounded-lg font-bold hover:bg-green-700 transition-colors shadow-md ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {loading ? 'Logging in...' : 'Login to Dashboard'}
      </button>

      {
      <p className="text-center text-sm text-gray-600">
        <button 
          type="button"
          onClick={() => navigate('/farmer-forgot-password')} 
          className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
        >
          Forgot password?
        </button>
      </p>
    </form>
  );
}

export default FarmerLogin;




import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

function FarmerLogin() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpField, setShowOtpField] = useState(false); 
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Step 1: Request OTP from Supabase (via Twilio Verify)
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Ensure the phone number starts with + for E.164 compliance
    const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;

    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      });

      if (error) {
        setError(error.message);
      } else {
        setShowOtpField(true);
      }
    } catch (err) {
      setError("Failed to send OTP. Please check your network and phone number.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify the 6-digit OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;

    try {
      const { data: { session }, error } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token: otp,
        type: 'sms',
      });

      if (error) {
        setError(error.message);
      } else if (session) {
        // Your handle_new_user trigger has now safely created the profile!
        navigate('/farmer-dashboard');
      }
    } catch (err) {
      setError("Verification failed. Please check the code and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {!showOtpField ? (
      
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1 text-sm text-left">
              Phone Number
            </label>
            <input
              type="tel"
              className="w-full p-2.5 border rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+919876543210"
              required
            />
            <p className="text-[10px] text-gray-400 mt-1 text-left italic">
              Include your country code (e.g., +91 for India)
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-md text-xs">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-green-600 text-white py-2.5 rounded-lg font-bold hover:bg-green-700 transition-colors shadow-md ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Sending SMS...' : 'Send Login OTP'}
          </button>
        </form>
      ) : (
       
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-4">
              OTP sent to <span className="font-bold text-gray-700">{phoneNumber}</span>
            </p>
            <label className="block text-gray-700 font-medium mb-2 text-sm">
              Enter 6-Digit Code
            </label>
            <input
              type="text"
              maxLength="6"
              className="w-full p-3 border-2 border-green-500 rounded-lg text-center tracking-[0.5em] text-xl font-black outline-none bg-green-50"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="••••••"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-md text-xs">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-green-600 text-white py-2.5 rounded-lg font-bold hover:bg-green-700 transition-colors shadow-md ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Verifying...' : 'Verify & Enter Dashboard'}
          </button>

          <button 
            type="button" 
            onClick={() => { setShowOtpField(false); setOtp(''); }} 
            className="w-full text-xs text-blue-600 hover:underline font-medium"
          >
            Edit Phone Number
          </button>
        </form>
      )}
    </div>
  );
}

export default FarmerLogin;
*/



import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

function FarmerLogin() {
  // Authentication States
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpField, setShowOtpField] = useState(false);
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  
  // Questionnaire States
  const [cropType, setCropType] = useState('');
  const [landSize, setLandSize] = useState('');
  const [location, setLocation] = useState('');

  // UI States
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Step 1: Send OTP via Twilio
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Ensure E.164 format (e.g., +91XXXXXXXXXX)
    const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;

    try {
      const { error: authError } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      });

      if (authError) throw authError;
      setShowOtpField(true);
    } catch (err) {
      setError(err.message || "Failed to send OTP. Check your number.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP and check Onboarding Status
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;

    try {
      const { data: { session }, error: verifyError } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token: otp,
        type: 'sms',
      });

      if (verifyError) throw verifyError;

      if (session) {
        // Fetch profile to see if onboarding is complete
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('has_completed_onboarding')
          .eq('id', session.user.id)
          .single();

        if (profile?.has_completed_onboarding) {
          navigate('/farmer-dashboard');
        } else {
          setShowQuestionnaire(true);
        }
      }
    } catch (err) {
      setError(err.message || "Invalid OTP code.");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Save Questionnaire Data
  const handleQuestionnaireSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          location: location,
          // We can store crop and land info in existing or custom columns
          full_name: `${cropType} Farmer`, 
          has_completed_onboarding: true 
        })
        .eq('id', user.id);

      if (updateError) throw updateError;
      navigate('/farmer-dashboard');
    } catch (err) {
      setError("Failed to save details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      {showQuestionnaire ? (
        /* PHASE 3: BENEFICIAL QUESTIONNAIRE */
        <form onSubmit={handleQuestionnaireSubmit} className="space-y-5 animate-in fade-in duration-500">
          <div className="text-center">
            <h2 className="text-xl font-bold text-green-700">Farmer Profile</h2>
            <p className="text-xs text-gray-500">Help us customize your Agrisetu experience</p>
          </div>

          <div className="space-y-4 text-left">
            <div>
              <label className="block text-gray-700 font-medium mb-1 text-sm">1. Primary Crop grown</label>
              <input
                type="text"
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-green-200 outline-none"
                value={cropType}
                onChange={(e) => setCropType(e.target.value)}
                placeholder="e.g., Rice, Tomato"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1 text-sm">2. Land Size (Acres)</label>
              <input
                type="number"
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-green-200 outline-none"
                value={landSize}
                onChange={(e) => setLandSize(e.target.value)}
                placeholder="e.g., 5"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1 text-sm">3. Cultivation Location</label>
              <input
                type="text"
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-green-200 outline-none"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Pune, Maharashtra"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 shadow-lg"
          >
            {loading ? 'Saving...' : 'Complete & Enter Dashboard'}
          </button>
        </form>
      ) : (
        /* PHASE 1 & 2: PHONE & OTP LOGIN */
        <div className="space-y-4">
          {!showOtpField ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="text-left">
                <label className="block text-gray-700 font-medium mb-1 text-sm">Phone Number</label>
                <input
                  type="tel"
                  className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-green-200 outline-none"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+919876543210"
                  required
                />
              </div>
              {error && <p className="text-red-500 text-xs">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-2.5 rounded-lg font-bold hover:bg-green-700"
              >
                {loading ? 'Sending OTP...' : 'Send Login OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-4">OTP sent to <b>{phoneNumber}</b></p>
                <input
                  type="text"
                  maxLength="6"
                  className="w-full p-3 border-2 border-green-500 rounded-lg text-center tracking-[0.5em] text-xl font-black bg-green-50 outline-none"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="••••••"
                  required
                />
              </div>
              {error && <p className="text-red-500 text-xs">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-2.5 rounded-lg font-bold hover:bg-green-700"
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
              <button 
                type="button" 
                onClick={() => setShowOtpField(false)} 
                className="w-full text-xs text-blue-600 hover:underline"
              >
                Change Phone Number
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

export default FarmerLogin;