// //FarmerLogin.jsx
 import { useState } from "react";
 import { supabase } from "../lib/supabaseClient";

 export default function FarmerLogin() {
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
     e.preventDefault();
     const { error } = await supabase.auth.signInWithOtp({ phone });
     if (error) setMessage(error.message);
     else setMessage("OTP sent! Check your phone.");
    };

   return (
    <div className="border border-yellow-300 bg-white p-6 rounded-xl shadow-lg">
       <h2 className="text-xl font-bold text-center text-gray-800 mb-6">
         Farmer Login
       </h2>

      <form onSubmit={handleLogin} className="space-y-5">
       <div>
           <label className="block text-gray-700 mb-1">Phone Number</label>
           <input
             type="tel"
             className="w-full p-2 border rounded"
             value={phone}
             onChange={(e) => setPhone(e.target.value)}
             placeholder="+91 9876543210"
             required
           />
         </div>

         {message && <p className="text-blue-500 text-sm">{message}</p>}

         <button
           type="submit"
           className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
         >
           Send OTP
        </button>
       </form>
      </div>
   );
}

// import React from 'react';

// function FarmerLogin() {
//   return (
//     <div>
//       <h2 className="text-2xl font-bold mb-4 text-center">Farmer Login</h2>
//       <input type="email" placeholder="Email" className="w-full p-2 mb-4 border rounded" />
//       <input type="password" placeholder="Password" className="w-full p-2 mb-4 border rounded" />
//       <button className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">
//         Login
//       </button>
//     </div>
//   );
// }

// export default FarmerLogin;

