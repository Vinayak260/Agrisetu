/*
import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
    } else {
      const { data: { user } } = await supabase.auth.getUser();
      const role = user?.user_metadata?.role || user?.app_metadata?.role;
      
      if (role === 'super-admin') {
        navigate('/dashboard');
      } else {
        setError('Access denied: Insufficient privileges.');
        await supabase.auth.signOut();
      }
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div>
        <label className="block text-gray-700 mb-1">Username/Email</label>
        <input
          type="email"
          className="w-full p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
      </div>
      <div>
        <label className="block text-gray-700 mb-1">Password</label>
        <input
          type="password"
          className="w-full p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
      >
        Login
      </button>
      <p className="text-center text-sm text-gray-600">
        <button onClick={() => navigate('/forgot-password')} className="text-blue-500 hover:text-blue-700 underline">
          Forgot password?
        </button>
      </p>
    </form>
  );
}

export default AdminLogin;
*/

/*
import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
    } else {
      const { data: { user } } = await supabase.auth.getUser();
      const role = user?.user_metadata?.role || user?.app_metadata?.role;
      
      if (role === 'super-admin') {
        navigate('/dashboard');
      } else {
        setError('Access denied: Insufficient privileges.');
        await supabase.auth.signOut();
      }
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div>
        <label className="block text-gray-700 mb-1">Username/Email</label>
        <input
          type="email"
          className="w-full p-2 border rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
      </div>
      <div>
        <label className="block text-gray-700 mb-1">Password</label>
        <input
          type="password"
          className="w-full p-2 border rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
      >
        Login
      </button>
      <p className="text-center text-sm text-gray-600">
      
       <button onClick={() => navigate('/admin-forgot-password')} className="text-blue-500 hover:text-blue-700 underline">
          Forgot password?
         </button>
       </p>
     </form>
   );
 }

 export default AdminLogin;


import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
    } else {
      const { data: { user } } = await supabase.auth.getUser();
      const role = user?.user_metadata?.role || user?.app_metadata?.role;
      
      if (role === 'super-admin') {
        navigate('/dashboard');
      } else {
        setError('Access denied: Insufficient privileges.');
        await supabase.auth.signOut();
      }
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div>
        <label className="block text-gray-700 mb-1">Username/Email</label>
        <input
          type="email"
          className="w-full p-2 border rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
      </div>
      <div>
        <label className="block text-gray-700 mb-1">Password</label>
        <input
          type="password"
          className="w-full p-2 border rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
      >
        Login
      </button>
      <p className="text-center text-sm text-gray-600">
        <button onClick={() => navigate('/admin-forgot-password')} className="text-blue-500 hover:text-blue-700 underline">
          Forgot password?
        </button>
      </p>
    </form>
  );
}

export default AdminLogin;
*/
/*
import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
    } else {
      const { data: { user } } = await supabase.auth.getUser();
      const role = user?.user_metadata?.role || user?.app_metadata?.role;
      
      if (role === 'super-admin') {
        navigate('/dashboard');
      } else {
        setError('Access denied: Insufficient privileges.');
        await supabase.auth.signOut();
      }
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div>
        <label className="block text-gray-700 mb-1">Username/Email</label>
        <input
          type="email"
          className="w-full p-2 border rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
      </div>
      <div>
        <label className="block text-gray-700 mb-1">Password</label>
        <input
          type="password"
          className="w-full p-2 border rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
      >
        Login
      </button>
      <p className="text-center text-sm text-gray-600">
      
        <button 
          onClick={() => navigate('/admin-forgot-password')} 
          className="text-blue-500 hover:text-blue-700 underline"
        >
          Forgot password?
        </button>
      </p>
    </form>
  );
}

export default AdminLogin;
*/

import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    try {
      // 1. Authenticate the user
      const { data, error: loginError } = await supabase.auth.signInWithPassword({ email, password });
      
      if (loginError) {
        setError(loginError.message);
        return;
      }

      // 2. Explicitly fetch the user to get fresh metadata
      const { data: { user } } = await supabase.auth.getUser();
      
      // 3. Extract the role from metadata
      const role = user?.user_metadata?.role;

      // DEBUG: Verify exactly what the code sees
      console.log("Detected Role:", role);

      // 4. THE FIX: Match the exact string 'super admin' as seen in your DB
      if (role === 'super admin') {
        console.log("Access Granted. Navigating to Admin Dashboard...");
        navigate('/admin'); 
      } else {
        // Sign out if they aren't an admin to prevent session contamination
        setError('Access denied: Insufficient privileges.');
        await supabase.auth.signOut();
      }
    } catch (err) {
      console.error("Login unexpected error:", err);
      setError("An unexpected error occurred.");
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">Login to your Account</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-1">Username/Email</label>
          <input
            type="email"
            className="w-full p-2 border rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="vinayak155@gmail.com"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Password</label>
          <input
            type="password"
            className="w-full p-2 border rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-2 text-red-600 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-lg hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-100"
        >
          Login
        </button>

        <p className="text-center text-sm text-gray-600 pt-2">
          <button 
            type="button"
            onClick={() => navigate('/admin-forgot-password')} 
            className="text-blue-500 hover:text-blue-700 underline"
          >
            Forgot password?
          </button>
        </p>

        <p className="text-center text-sm text-gray-500">
          Not registered yet? <span className="text-blue-500 cursor-pointer" onClick={() => navigate('/signup')}>sign up here</span>
        </p>
      </form>
    </div>
  );
}

export default AdminLogin;

     