// import React from 'react';
// import AdminSignup from './AdminSignup';
// import { useNavigate } from 'react-router-dom';

// function AdminSignupPage() {
//   const navigate = useNavigate();

//   return (
//     <div className="min-h-screen relative flex items-center justify-center">
//       <div 
//         className="absolute inset-0 bg-cover bg-center"
//         style={{ backgroundImage: "url('https://images.pexels.com/photos/1595104/pexels-photo-1595104.jpeg?auto=compress&cs=tinysrgb&w=1600')" }}
//       ></div>
//       <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/30"></div>
//       <div className="relative max-w-md p-6 bg-white rounded-xl shadow-lg border-2 border-yellow-200 m-4">
//         <AdminSignup />
//         <p className="mt-4 text-sm text-gray-600 text-center">
//           Already have an account?{" "}
//           <button
//             onClick={() => navigate('/admin-login')}
//             className="text-blue-500 hover:text-blue-700 underline"
//           >
//             Login
//           </button>
//         </p>
//       </div>
//     </div>
//   );
// }

// export default AdminSignupPage;

// import React, { useState } from 'react';
// import { supabase } from '../lib/supabaseClient';
// import { useNavigate } from 'react-router-dom';

// function AdminSignupPage() {
//   const [firstName, setFirstName] = useState('');
//   const [lastName, setLastName] = useState('');
//   const [email, setEmail] = useState('');
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [errors, setErrors] = useState({});
//   const navigate = useNavigate();

//   const validateForm = () => {
//     const newErrors = {};

//     if (!firstName.trim()) newErrors.firstName = 'First Name is required';
//     if (!lastName.trim()) newErrors.lastName = 'Last Name is required';
//     if (!email.trim()) newErrors.email = 'Email is required';
//     else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
//     if (!username.trim()) newErrors.username = 'Username is required';
//     else if (username.length < 6) newErrors.username = 'Username must be at least 6 characters';
//     if (!password) newErrors.password = 'Password is required';
//     else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
//     if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSignup = async (e) => {
//     e.preventDefault();
//     setError('');
//     setSuccess('');

//     if (!validateForm()) return;

//     const { data, error } = await supabase.auth.signUp({
//       email,
//       password,
//       options: {
//         data: { firstName, lastName, username, role: 'admin' }
//       }
//     });

//     if (error) {
//       setError(error.message);
//     } else {
//       setSuccess('Signup successful! Please check your email to confirm.');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col">
//       {/* Header */}
//       <header className="bg-green-700 text-white p-4 text-center">
//         <h1 className="text-2xl font-bold">Agrisetu</h1>
//         <p className="text-sm">Bridges the gap between Farmers and technology</p>
//       </header>

//       {/* Signup Form */}
//       <div className="flex-1 flex items-center justify-center p-4">
//         <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 border-2 border-blue-300">
//           <h2 className="text-xl font-semibold text-center mb-6">Register for Membership</h2>
//           <p className="text-sm text-gray-600 text-center mb-6">If you are an existing member of AgriSetu, please log in to continue.</p>
//           <form onSubmit={handleSignup} className="space-y-4">
//             <div className="grid grid-cols-2 gap-2">
//               <div>
//                 <label className="block text-gray-700 mb-1">* First & Last Name</label>
//                 <input
//                   type="text"
//                   className="w-full p-2 border rounded focus:border-blue-500"
//                   value={firstName}
//                   onChange={(e) => setFirstName(e.target.value)}
//                   placeholder="First Name"
//                   required
//                 />
//                 {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
//               </div>
//               <div>
//                 <input
//                   type="text"
//                   className="w-full p-2 border rounded focus:border-blue-500"
//                   value={lastName}
//                   onChange={(e) => setLastName(e.target.value)}
//                   placeholder="Last Name"
//                   required
//                 />
//                 {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
//               </div>
//             </div>
//             <div>
//               <label className="block text-gray-700 mb-1">* Your E-Mail Address</label>
//               <input
//                 type="email"
//                 className="w-full p-2 border rounded focus:border-blue-500"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder="Your E-Mail Address"
//                 required
//               />
//               <p className="text-sm text-gray-500 mt-1">A confirmation email will be sent to you at this address.</p>
//               {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
//             </div>
//             <div>
//               <label className="block text-gray-700 mb-1">* Choose a Username</label>
//               <input
//                 type="text"
//                 className="w-full p-2 border rounded focus:border-blue-500"
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//                 placeholder="Username (6+ characters)"
//                 required
//               />
//               <p className="text-sm text-gray-500 mt-1">It must be 6 or more characters in length and may only contain letters, numbers, and underscores.</p>
//               {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
//             </div>
//             <div>
//               <label className="block text-gray-700 mb-1">* Choose a Password</label>
//               <input
//                 type="password"
//                 className="w-full p-2 border rounded focus:border-blue-500"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="Password (6+ characters)"
//                 required
//               />
//               <p className="text-sm text-gray-500 mt-1">Must be 6 or more characters.</p>
//               {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
//             </div>
//             <div>
//               <label className="block text-gray-700 mb-1">* Confirm Your Password</label>
//               <input
//                 type="password"
//                 className="w-full p-2 border rounded focus:border-blue-500"
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//                 placeholder="Confirm Password"
//                 required
//               />
//               {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
//             </div>
//             {error && <p className="text-red-500 text-sm text-center">{error}</p>}
//             {success && <p className="text-green-500 text-sm text-center">{success}</p>}
//             <button
//               type="submit"
//               className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
//             >
//               Sign Up
//             </button>
//           </form>
//           <p className="text-center text-sm text-gray-600 mt-4">
//             Already have an account? <button onClick={() => navigate('/admin-login')} className="text-blue-500 hover:text-blue-700 underline">Login</button>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AdminSignupPage;

/*
import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

function AdminSignupPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!firstName.trim()) newErrors.firstName = 'First Name is required';
    if (!lastName.trim()) newErrors.lastName = 'Last Name is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    if (!username.trim()) newErrors.username = 'Username is required';
    else if (username.length < 6) newErrors.username = 'Username must be at least 6 characters';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) return;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { firstName, lastName, username, role: 'admin' }
      }
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess('Signup successful! Please check your email to confirm.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-green-700 text-white p-4 text-center">
        <h1 className="text-2xl font-bold">Agrisetu</h1>
        <p className="text-sm">Bridges the gap between Farmers and technology</p>
      </header>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 border-2 border-blue-300">
          <h2 className="text-xl font-semibold text-center mb-6">Register for Membership</h2>
          <p className="text-sm text-gray-600 text-center mb-6">If you are an existing member of AgriSetu, please log in to continue.</p>
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-gray-700 mb-1">* First & Last Name</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First Name"
                  required
                />
                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <input
                  type="text"
                  className="w-full p-2 border rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last Name"
                  required
                />
                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
              </div>
            </div>
            <div>
              <label className="block text-gray-700 mb-1">* Your E-Mail Address</label>
              <input
                type="email"
                className="w-full p-2 border rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your E-Mail Address"
                required
              />
              <p className="text-sm text-gray-500 mt-1">A confirmation email will be sent to you at this address.</p>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-gray-700 mb-1">* Choose a Username</label>
              <input
                type="text"
                className="w-full p-2 border rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username (6+ characters)"
                required
              />
              <p className="text-sm text-gray-500 mt-1">It must be 6 or more characters in length and may only contain letters, numbers, and underscores.</p>
              {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
            </div>
            <div>
              <label className="block text-gray-700 mb-1">* Choose a Password</label>
              <input
                type="password"
                className="w-full p-2 border rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password (6+ characters)"
                required
              />
              <p className="text-sm text-gray-500 mt-1">Must be 6 or more characters.</p>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>
            <div>
              <label className="block text-gray-700 mb-1">* Confirm Your Password</label>
              <input
                type="password"
                className="w-full p-2 border rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                required
              />
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            {success && <p className="text-green-500 text-sm text-center">{success}</p>}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Sign Up
            </button>
          </form>
          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account? <button onClick={() => navigate('/admin-login')} className="text-blue-500 hover:text-blue-700 underline">Login</button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminSignupPage;
*/

/*
import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

function AdminSignupPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!firstName.trim()) newErrors.firstName = 'First Name is required';
    if (!lastName.trim()) newErrors.lastName = 'Last Name is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    if (!username.trim()) newErrors.username = 'Username is required';
    else if (username.length < 6) newErrors.username = 'Username must be at least 6 characters';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) return;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { firstName, lastName, username, role: 'admin' }
      }
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess('Signup successful! Please check your email to confirm.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      
      <header className="bg-green-700 text-white p-4 text-center">
        <h1 className="text-2xl font-bold">Agrisetu</h1>
        <p className="text-sm">Bridges the gap between Farmers and technology</p>
      </header>

     
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 border-2 border-blue-300">
          <h2 className="text-xl font-semibold text-center mb-6">Register for Membership</h2>
          <p className="text-sm text-gray-600 text-center mb-6">If you are an existing member of AgriSetu, please log in to continue.</p>
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-gray-700 mb-1">* First & Last Name</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First Name"
                  required
                />
                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <input
                  type="text"
                  className="w-full p-2 border rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last Name"
                  required
                />
                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
              </div>
            </div>
            <div>
              <label className="block text-gray-700 mb-1">* Your E-Mail Address</label>
              <input
                type="email"
                className="w-full p-2 border rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your E-Mail Address"
                required
              />
              <p className="text-sm text-gray-500 mt-1">A confirmation email will be sent to you at this address.</p>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-gray-700 mb-1">* Choose a Username</label>
              <input
                type="text"
                className="w-full p-2 border rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username (6+ characters)"
                required
              />
              <p className="text-sm text-gray-500 mt-1">It must be 6 or more characters in length and may only contain letters, numbers, and underscores.</p>
              {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
            </div>
            <div>
              <label className="block text-gray-700 mb-1">* Choose a Password</label>
              <input
                type="password"
                className="w-full p-2 border rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password (6+ characters)"
                required
              />
              <p className="text-sm text-gray-500 mt-1">Must be 6 or more characters.</p>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>
            <div>
              <label className="block text-gray-700 mb-1">* Confirm Your Password</label>
              <input
                type="password"
                className="w-full p-2 border rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                required
              />
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            {success && <p className="text-green-500 text-sm text-center">{success}</p>}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Sign Up
            </button>
          </form>
          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account? <button onClick={() => navigate('/admin-login')} className="text-blue-500 hover:text-blue-700 underline">Login</button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminSignupPage;
*/


import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

function AdminSignupPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!firstName.trim()) newErrors.firstName = 'First Name is required';
    if (!lastName.trim()) newErrors.lastName = 'Last Name is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    if (!username.trim()) newErrors.username = 'Username is required';
    else if (username.length < 6) newErrors.username = 'Username must be at least 6 characters';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) return;

    // The logic here passes metadata to Supabase Auth.
    // The Database Trigger you created in the SQL Editor will catch this 
    // and automatically create a row in your 'profiles' table.
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { 
          full_name: `${firstName} ${lastName}`, // Combined for the profiles table
          firstName, 
          lastName, 
          username, 
          role: 'Admin' // Explicitly setting role as Admin
        }
      }
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess('Signup successful! Please check your email to confirm. Once confirmed, you will appear in the Admin Dashboard.');
      // Optional: Auto-navigate to login after a delay
      setTimeout(() => navigate('/admin-login'), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-green-700 text-white p-6 shadow-lg text-center">
        <h1 className="text-3xl font-black tracking-tight">AgriSetu</h1>
        <p className="text-sm opacity-90 uppercase tracking-widest mt-1">Bridges the gap between Farmers and technology</p>
      </header>

      {/* Signup Form */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">Admin Registration</h2>
          <p className="text-sm text-gray-500 text-center mb-8">Join the AgriSetu management team.</p>
          
          <form onSubmit={handleSignup} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">First Name</label>
                <input
                  type="text"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                  required
                />
                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Last Name</label>
                <input
                  type="text"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  required
                />
                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">E-Mail Address</label>
              <input
                type="email"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@agrisetu.com"
                required
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Username</label>
              <input
                type="text"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin_user_01"
                required
              />
              {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Password</label>
                <input
                  type="password"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Confirm</label>
                <input
                  type="password"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>

            {error && <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl text-center font-medium">{error}</div>}
            {success && <div className="p-3 bg-green-50 border border-green-100 text-green-600 text-sm rounded-xl text-center font-medium">{success}</div>}

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-green-200 hover:bg-green-700 hover:shadow-xl transition-all active:scale-95"
            >
              Create Admin Account
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500">
              Already a member?{" "}
              <button onClick={() => navigate('/admin-login')} className="text-green-600 font-bold hover:underline">
                Login here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminSignupPage;
