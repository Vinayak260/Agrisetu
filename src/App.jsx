// // // import React from 'react';
// // //    import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// // //    import LandingPage from './components/LandingPage';
// // //    import FarmerLoginPage from './components/FarmerLoginPage';
// // //    import AdminLoginPage from './components/AdminLoginPage';
// // //    import AdminSignupPage from './components/AdminSignupPage';

// // //    function App() {
// // //      return (
// // //        <Router>
// // //          <Routes>
// // //            <Route path="/" element={<LandingPage />} /> {/* Default route */}
// // //            <Route path="/farmer-login" element={<FarmerLoginPage />} />
// // //            <Route path="/admin-login" element={<AdminLoginPage />} />
// // //            <Route path="/admin-signup" element={<AdminSignupPage />} />
// // //          </Routes>
// // //        </Router>
// // //      );
// // //    }

// // //    export default App;

// // // import React from 'react';
// // // import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// // // import LandingPage from './components/LandingPage';
// // // import FarmerLoginPage from './components/FarmerLoginPage';
// // // import AdminLoginPage from './components/AdminLoginPage';
// // // import AdminSignupPage from './components/AdminSignupPage';
// // // import ForgotPasswordPage from './components/ForgotPasswordPage';

// // // function App() {
// // //   return (
// // //     <Router>
// // //       <Routes>
// // //         <Route path="/" element={<LandingPage />} />
// // //         <Route path="/farmer-login" element={<FarmerLoginPage />} />
// // //         <Route path="/admin-login" element={<AdminLoginPage />} />
// // //         <Route path="/admin-signup" element={<AdminSignupPage />} />
// // //         <Route path="/forgot-password" element={<ForgotPasswordPage />} />
// // //       </Routes>
// // //     </Router>
// // //   );
// // // }

// // // export default App;

// // import React from 'react';
// // import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// // import LandingPage from './components/LandingPage';
// // import FarmerLoginPage from './components/FarmerLoginPage';
// // import AdminLoginPage from './components/AdminLoginPage';
// // import FarmerSignupPage from './components/FarmerSignupPage';
// // import AdminSignupPage from './components/AdminSignupPage';
// // import ForgotPasswordPage from './components/ForgotPasswordPage';

// // function App() {
// //   return (
// //     <Router>
// //       <Routes>
// //         <Route path="/" element={<LandingPage />} />
// //         <Route path="/farmer-login" element={<FarmerLoginPage />} />
// //         <Route path="/admin-login" element={<AdminLoginPage />} />
// //         <Route path="/farmer-signup" element={<FarmerSignupPage />} />
// //         <Route path="/admin-signup" element={<AdminSignupPage />} />
// //         <Route path="/forgot-password" element={<ForgotPasswordPage />} />
// //       </Routes>
// //     </Router>
// //   );
// // }

// // export default App;

/*
 import React from 'react';
 import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
 import LandingPage from './components/LandingPage';
 import FarmerLoginPage from './components/FarmerLoginPage';
 import AdminLoginPage from './components/AdminLoginPage';
 import FarmerSignupPage from './components/FarmerSignupPage';
 import AdminSignupPage from './components/AdminSignupPage';
 import ForgotPasswordPage from './components/ForgotPasswordPage';
 import UpdatePasswordPage from './components/UpdatePasswordPage';
 import FarmerForgotPasswordPage from './components/FarmerForgotPasswordPage';
 import FarmerUpdatePasswordPage from './components/FarmerUpdatePasswordPage';

 function App() {
   return (
     <Router>
       <Routes>
         <Route path="/" element={<LandingPage />} />
         <Route path="/farmer-login" element={<FarmerLoginPage />} />
         <Route path="/admin-login" element={<AdminLoginPage />} />
         <Route path="/farmer-signup" element={<FarmerSignupPage />} />
         <Route path="/admin-signup" element={<AdminSignupPage />} />
         <Route path="/forgot-password" element={<ForgotPasswordPage />} />
         <Route path="/update-password" element={<UpdatePasswordPage />} />
         <Route path="/farmer-forgot-password" element={<FarmerForgotPasswordPage />} />
         <Route path="/farmer-update-password" element={<FarmerUpdatePasswordPage />} />
       </Routes>
     </Router>
   );
 }

 export default App;
 */

// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// // 🛠️ FIX: Reverting imports to assume components are in a 'components' subdirectory
// import ErrorBoundary from './components/ErrorBoundary';

// // Import all Auth components
// import AdminLoginPage from './components/AdminLoginPage';
// import AdminSignupPage from './components/AdminSignupPage';
// // Note: AdminForgotPasswordPage must be created in your components folder
// import AdminForgotPasswordPage from './components/AdminForgotPasswordPage'; 

// import FarmerLoginPage from './components/FarmerLoginPage';
// import FarmerSignupPage from './components/FarmerSignupPage';
// import FarmerForgotPasswordPage from './components/FarmerForgotPasswordPage';
// import FarmerUpdatePasswordPage from './components/FarmerUpdatePasswordPage';

// // Placeholder for a protected Dashboard page
// const Dashboard = () => (
//   <div className="min-h-screen flex items-center justify-center bg-gray-100">
//     <h1 className="text-3xl font-bold text-green-700">Welcome to the Dashboard!</h1>
//   </div>
// );

// function App() {
//   return (
//     <ErrorBoundary>
//       <Router>
//         <Routes>
//           {/* Default/Root Route */}
//           <Route path="/" element={<FarmerLoginPage />} />

//           {/* Farmer Routes */}
//           <Route path="/farmer-login" element={<FarmerLoginPage />} /> 
//           <Route path="/farmer-signup" element={<FarmerSignupPage />} />
//           <Route path="/farmer-forgot-password" element={<FarmerForgotPasswordPage />} />
//           <Route path="/farmer-update-password" element={<FarmerUpdatePasswordPage />} />

//           {/* Admin Routes */}
//           <Route path="/admin-login" element={<AdminLoginPage />} />
//           <Route path="/admin-signup" element={<AdminSignupPage />} />
//           {/* Ensures the admin forgot password flow uses its own route */}
//           <Route path="/admin-forgot-password" element={<AdminForgotPasswordPage />} /> 

//           {/* Protected Route Example */}
//           <Route path="/dashboard" element={<Dashboard />} />

//           {/* 404 Catch-all Route */}
//           <Route 
//             path="*" 
//             element={
//               <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
//                 <h1 className="text-4xl font-bold text-red-600">404</h1>
//                 <p className="text-xl text-gray-700">Page Not Found</p>
//               </div>
//             } 
//           />
//         </Routes>
//       </Router>
//     </ErrorBoundary>
//   );
// }

// export default App;

/*import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import FarmerLoginPage from './components/FarmerLoginPage';
import AdminLoginPage from './components/AdminLoginPage';
import FarmerSignupPage from './components/FarmerSignupPage';
import AdminSignupPage from './components/AdminSignupPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import UpdatePasswordPage from './components/UpdatePasswordPage';
import AdminForgotPasswordPage from './components/AdminForgotPasswordPage';
import AdminUpdatePasswordPage from './components/AdminUpdatePasswordPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/farmer-login" element={<FarmerLoginPage />} />
        <Route path="/admin-login" element={<AdminLoginPage />} />
        <Route path="/farmer-signup" element={<FarmerSignupPage />} />
        <Route path="/admin-signup" element={<AdminSignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/update-password" element={<UpdatePasswordPage />} />
         <Route path="/admin-forgot-password" element={<AdminForgotPasswordPage />} />
         <Route path="/admin-update-password" element={<AdminUpdatePasswordPage />} />
      </Routes>
    </Router>
  );
}

export default App;
*/

/*

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import FarmerLoginPage from './components/FarmerLoginPage';
import AdminLoginPage from './components/AdminLoginPage';
import FarmerSignupPage from './components/FarmerSignupPage';
import AdminSignupPage from './components/AdminSignupPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import UpdatePasswordPage from './components/UpdatePasswordage';
import FarmerUpdatePasswordPage from './components/FarmerUpdatePasswordPage';
import FarmerForgotPasswordPage from './components/FarmerForgotPasswordPage'; // Add this import
// import FarmerChat from "./components/FarmerChat";



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/farmer-login" element={<FarmerLoginPage />} />
        <Route path="/admin-login" element={<AdminLoginPage />} />
        <Route path="/farmer-signup" element={<FarmerSignupPage />} />
        <Route path="/admin-signup" element={<AdminSignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/update-password" element={<UpdatePasswordPage />} />
        <Route path="/farmer-update-password" element={<FarmerUpdatePasswordPage />} />
        <Route path="/farmer-forgot-password" element={<FarmerForgotPasswordPage />} /> 

//       </Routes>
//     </Router>
//   );
// }

// export default App;
*/

/*
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Existing Auth Components
import LandingPage from './components/LandingPage';
import FarmerLoginPage from './components/FarmerLoginPage';
import AdminLoginPage from './components/AdminLoginPage';
import FarmerSignupPage from './components/FarmerSignupPage';
import AdminSignupPage from './components/AdminSignupPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import UpdatePasswordPage from './components/UpdatePasswordage';
import FarmerUpdatePasswordPage from './components/FarmerUpdatePasswordPage';
import FarmerForgotPasswordPage from './components/FarmerForgotPasswordPage';

// New Admin Dashboard Components (to be created in components/admin/)
import AdminLayout from './components/admin/adminLayout';
import Dashboard from './components/admin/Dashboard';
import PendingUsers from './components/admin/PendingUsers';
import AllUsers from './components/admin/AllUsers';
import UserProfiles from './components/admin/UserProfiles';

function App() {
  return (
    <Router>
      <Routes>
        
        <Route path="/" element={<LandingPage />} />
        <Route path="/farmer-login" element={<FarmerLoginPage />} />
        <Route path="/farmer-signup" element={<FarmerSignupPage />} />
        <Route path="/farmer-forgot-password" element={<FarmerForgotPasswordPage />} />
        <Route path="/farmer-update-password" element={<FarmerUpdatePasswordPage />} />

       
        <Route path="/admin-login" element={<AdminLoginPage />} />
        <Route path="/admin-signup" element={<AdminSignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/update-password" element={<UpdatePasswordPage />} />

        
        <Route path="/admin" element={<AdminLayout />}>
          
          <Route index element={<Dashboard />} /> 
          
          
          <Route path="pending" element={<PendingUsers />} />   
          <Route path="all-users" element={<AllUsers />} />     
          <Route path="profiles" element={<UserProfiles />} />   
          
          
          <Route path="feedback" element={<div className="p-8 text-2xl">Feedback Coming Soon</div>} />
          <Route path="analytics" element={<div className="p-8 text-2xl">Analytics Coming Soon</div>} />
        </Route>

        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

*/

/*

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// --- AUTH COMPONENTS ---
import LandingPage from './components/LandingPage';
import FarmerLoginPage from './components/FarmerLoginPage';
import AdminLoginPage from './components/AdminLoginPage';
import FarmerSignupPage from './components/FarmerSignupPage';
import AdminSignupPage from './components/AdminSignupPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import UpdatePasswordPage from './components/UpdatePasswordage';
import FarmerUpdatePasswordPage from './components/FarmerUpdatePasswordPage';
import FarmerForgotPasswordPage from './components/FarmerForgotPasswordPage';

// --- FARMER FEATURES (New) ---
// --- Update these lines at the top of App.jsx ---
// src/App.jsx

// Use /src/ to ensure Vite finds the folder regardless of nesting depth
import FarmerDashboard from "/src/pages/FarmerDashboard.jsx";
import AIAssistant from "/src/features/ai-assistant/AIAssistant.jsx";
import KrushiDoctor from "/src/features/krushi-doctor/KrushiDoctor.jsx";
import WeatherDashboard from "/src/features/weather/StatsGrid.jsx";

// --- ADMIN DASHBOARD COMPONENTS ---
import AdminLayout from './components/admin/adminLayout';
import Dashboard from './components/admin/Dashboard';
import PendingUsers from './components/admin/PendingUsers';
import AllUsers from './components/admin/AllUsers';
import UserProfiles from './components/admin/UserProfiles';

function App() {
  return (
    <Router>
      <Routes>
       
        <Route path="/" element={<LandingPage />} />

        
        <Route path="/farmer-login" element={<FarmerLoginPage />} />
        <Route path="/farmer-signup" element={<FarmerSignupPage />} />
        <Route path="/farmer-forgot-password" element={<FarmerForgotPasswordPage />} />
        <Route path="/farmer-update-password" element={<FarmerUpdatePasswordPage />} />
        
       
        <Route path="/farmer-dashboard" element={<FarmerDashboard />} />

      
        <Route path="/admin-login" element={<AdminLoginPage />} />
        <Route path="/admin-signup" element={<AdminSignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/update-password" element={<UpdatePasswordPage />} />

       
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} /> 
          <Route path="pending" element={<PendingUsers />} />
          <Route path="all-users" element={<AllUsers />} />
          <Route path="profiles" element={<UserProfiles />} />
          <Route path="feedback" element={<div className="p-8 text-2xl">Feedback Coming Soon</div>} />
          <Route path="analytics" element={<div className="p-8 text-2xl">Analytics Coming Soon</div>} />
        </Route>

    
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;


import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// --- AUTH COMPONENTS ---
import LandingPage from './components/LandingPage';
import FarmerLoginPage from './components/FarmerLoginPage';
import AdminLoginPage from './components/AdminLoginPage';
import FarmerSignupPage from './components/FarmerSignupPage';
import AdminSignupPage from './components/AdminSignupPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import UpdatePasswordPage from './components/UpdatePasswordage';
import FarmerUpdatePasswordPage from './components/FarmerUpdatePasswordPage';
import FarmerForgotPasswordPage from './components/FarmerForgotPasswordPage';

// --- FARMER FEATURES ---
// Removed the leading /src/ as Vite handles relative paths better in standard imports
import FarmerDashboard from "./pages/FarmerDashboard";
import AIAssistant from "./features/ai-assistant/AIAssistant";
import KrushiDoctor from "./features/krushi-doctor/KrushiDoctor";
import WeatherDashboard from "./features/weather/StatsGrid";

// --- ADMIN DASHBOARD COMPONENTS ---
import AdminLayout from './components/admin/adminLayout';
import Dashboard from './components/admin/Dashboard';
import PendingUsers from './components/admin/PendingUsers';
import AllUsers from './components/admin/AllUsers';
import UserProfiles from './components/admin/UserProfiles';

function App() {
  return (
    <Router>
      <Routes>
        
        <Route path="/" element={<LandingPage />} />

        
        <Route path="/farmer-login" element={<FarmerLoginPage />} />
        <Route path="/farmer-signup" element={<FarmerSignupPage />} />
        <Route path="/farmer-forgot-password" element={<FarmerForgotPasswordPage />} />
        <Route path="/farmer-update-password" element={<FarmerUpdatePasswordPage />} />
        
        
        <Route path="/farmer-dashboard" element={<FarmerDashboard />} />

        
        <Route path="/admin-login" element={<AdminLoginPage />} />
        <Route path="/admin-signup" element={<AdminSignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/update-password" element={<UpdatePasswordPage />} />

        
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} /> 
          <Route path="pending" element={<PendingUsers />} />
          <Route path="all-users" element={<AllUsers />} />
          <Route path="profiles" element={<UserProfiles />} />
          <Route path="feedback" element={<div className="p-8 text-2xl text-green-800 font-bold">Feedback Coming Soon</div>} />
          <Route path="analytics" element={<div className="p-8 text-2xl text-green-800 font-bold">Analytics Coming Soon</div>} />
        </Route>

      
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
*/

import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabaseClient';

// --- AUTH COMPONENTS ---
import LandingPage from './components/LandingPage';
import FarmerLoginPage from './components/FarmerLoginPage';
import AdminLoginPage from './components/AdminLoginPage';
import FarmerSignupPage from './components/FarmerSignupPage';
import AdminSignupPage from './components/AdminSignupPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import UpdatePasswordPage from './components/UpdatePasswordage';
import FarmerUpdatePasswordPage from './components/FarmerUpdatePasswordPage';
import FarmerForgotPasswordPage from './components/FarmerForgotPasswordPage';

// --- FARMER FEATURES ---
import FarmerDashboard from "./pages/FarmerDashboard";
import AIAssistant from "./features/ai-assistant/AIAssistant";
import KrushiDoctor from "./features/krushi-doctor/KrushiDoctor";
import ReportHistory from './components/farmer/ReportHistory';

// --- ADMIN DASHBOARD COMPONENTS ---
import AdminLayout from './components/admin/adminLayout';
import Dashboard from './components/admin/Dashboard';
import PendingUsers from './components/admin/PendingUsers';
import AllUsers from './components/admin/AllUsers';
import UserProfiles from './components/admin/UserProfiles';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
    </div>
  );

  return (
    <Router>
      <Routes>
        {/* --- Public Landing --- */}
        <Route path="/" element={<LandingPage />} />

        {/* --- Farmer Auth --- */}
        <Route path="/farmer-login" element={!session ? <FarmerLoginPage /> : <Navigate to="/farmer-dashboard" />} />
        <Route path="/farmer-signup" element={<FarmerSignupPage />} />
        <Route path="/farmer-forgot-password" element={<FarmerForgotPasswordPage />} />
        <Route path="/farmer-update-password" element={<FarmerUpdatePasswordPage />} />

        {/* --- PROTECTED FARMER ROUTES --- */}
        {/* WeatherPage Route has been removed from here */}
        <Route path="/farmer-dashboard" element={session ? <FarmerDashboard /> : <Navigate to="/farmer-login" />} />
        <Route path="/ai-assistant" element={session ? <AIAssistant /> : <Navigate to="/farmer-login" />} />
        <Route path="/krushi-doctor" element={session ? <KrushiDoctor /> : <Navigate to="/farmer-login" />} />
        <Route path="/farmer/history" element={<ReportHistory />} />

        {/* --- Admin Auth Routes --- */}
        <Route path="/admin-login" element={<AdminLoginPage />} />
        <Route path="/admin-signup" element={<AdminSignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/update-password" element={<UpdatePasswordPage />} />

        {/* --- Admin Dashboard (Nested Routing) --- */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="pending" element={<PendingUsers />} />
          <Route path="all-users" element={<AllUsers />} />
          <Route path="profiles" element={<UserProfiles />} />
          <Route path="feedback" element={<div className="p-8 text-2xl text-green-800 font-bold text-center">Feedback Coming Soon</div>} />
          <Route path="analytics" element={<div className="p-8 text-2xl text-green-800 font-bold text-center">Analytics Coming Soon</div>} />
        </Route>

        {/* --- 404 Redirect --- */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;