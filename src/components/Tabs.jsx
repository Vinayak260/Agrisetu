import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FarmerLogin from "./FarmerLogin";
import AdminLogin from "./AdminLogin";

function Tabs() {
  const [activeTab, setActiveTab] = useState("farmer");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === "/admin-login") setActiveTab("admin");
    else setActiveTab("farmer");
  }, [location]);

  const handleSignupClick = () => {
    navigate("/admin-signup");
  };

  return (
    <div className="max-w-md mx-auto mt-10 border rounded-xl shadow-lg p-6 bg-white">
      <div className="flex mb-6">
        <button
          onClick={() => setActiveTab("farmer")}
          className={`flex-1 p-2 text-sm font-medium rounded-t-lg ${activeTab === "farmer" ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700"}`}
        >
          Farmer Login
        </button>
        <button
          onClick={() => setActiveTab("admin")}
          className={`flex-1 p-2 text-sm font-medium rounded-t-lg ${activeTab === "admin" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
        >
          Admin Login
        </button>
      </div>
      {activeTab === "farmer" && <FarmerLogin />}
      {activeTab === "admin" && (
        <div>
          <AdminLogin />
          <p className="mt-4 text-sm text-gray-600 text-center">
            Don't have an account?{" "}
            <button onClick={handleSignupClick} className="text-blue-500 hover:text-blue-700 underline">
              Sign up
            </button>
          </p>
        </div>
      )}
    </div>
  );
}

export default Tabs;