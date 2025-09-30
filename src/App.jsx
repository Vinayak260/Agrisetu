import React from 'react';
   import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
   import LandingPage from './components/LandingPage';
   import FarmerLoginPage from './components/FarmerLoginPage';
   import AdminLoginPage from './components/AdminLoginPage';
   import AdminSignupPage from './components/AdminSignupPage';

   function App() {
     return (
       <Router>
         <Routes>
           <Route path="/" element={<LandingPage />} /> {/* Default route */}
           <Route path="/farmer-login" element={<FarmerLoginPage />} />
           <Route path="/admin-login" element={<AdminLoginPage />} />
           <Route path="/admin-signup" element={<AdminSignupPage />} />
         </Routes>
       </Router>
     );
   }

   export default App;