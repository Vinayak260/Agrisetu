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
    <div
      className="bg-white p-8 rounded-2xl w-full max-w-md mx-auto
        border-2 border-gray-200
        shadow-lg
        transition-all duration-300 ease-in-out
        hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-100 hover:-translate-y-1"
    >
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Login to your Account</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-gray-600 font-medium mb-1 text-sm">Username/Email</label>
          <input
            type="email"
            className="w-full p-3 border border-gray-200 rounded-lg
              focus:border-blue-500 focus:ring-2 focus:ring-blue-200
              hover:border-gray-400
              outline-none transition-all duration-200 bg-gray-50"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="vinayak155@gmail.com"
            required
          />
        </div>
        <div>
          <label className="block text-gray-600 font-medium mb-1 text-sm">Password</label>
          <input
            type="password"
            className="w-full p-3 border border-gray-200 rounded-lg
              focus:border-blue-500 focus:ring-2 focus:ring-blue-200
              hover:border-gray-400
              outline-none transition-all duration-200 bg-gray-50"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-3 text-red-600 text-sm rounded-r-lg">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl
            shadow-md shadow-blue-200
            hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-300 hover:-translate-y-0.5
            active:scale-95 active:shadow-sm
            transition-all duration-200"
        >
          Login
        </button>

        <p className="text-center text-sm text-gray-600 pt-1">
          <button
            type="button"
            onClick={() => navigate('/admin-forgot-password')}
            className="text-blue-500 hover:text-blue-700 underline underline-offset-2 transition-colors"
          >
            Forgot password?
          </button>
        </p>

        <p className="text-center text-sm text-gray-500 border-t border-gray-100 pt-4 mt-2">
          Not registered yet?{' '}
          <span
            className="text-blue-500 cursor-pointer hover:text-blue-700 underline underline-offset-2 transition-colors font-medium"
            onClick={() => navigate('/admin-signup')}
          >
            sign up here
          </span>
        </p>
      </form>
    </div>
  );
}

export default AdminLogin;