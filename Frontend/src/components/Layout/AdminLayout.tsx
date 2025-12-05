// src/components/Layout/AdminLayout.tsx
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Doctors", path: "/admin/doctors" },
    { name: "Medicines", path: "/admin/medicines" },
    { name: "Patients", path: "/admin/patients" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700 text-gray-100 flex flex-col shadow-lg">
        
        {/* Logo Section */}
        <div className="p-6 border-b border-indigo-600">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Hospital <span className="text-indigo-300">Admin</span>
          </h1>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  group flex items-center gap-3 px-4 py-3 rounded-lg font-medium
                  transition-all duration-300 relative overflow-hidden
                  ${active
                    ? "bg-indigo-600 text-white shadow-xl scale-[1.02]"
                    : "hover:bg-indigo-500 hover:text-white"
                  }
                `}
              >
                {/* Left accent bar */}
                <span
                  className={`
                    absolute left-0 top-0 h-full w-1 rounded-r-lg transition-all
                    ${active ? "bg-white" : "bg-indigo-300 opacity-0 group-hover:opacity-100"}
                  `}
                ></span>

                {/* Item Name */}
                <span className="relative z-10">{item.name}</span>

                {/* Hover glow background */}
                <span
                  className={`
                    absolute inset-0 opacity-0 group-hover:opacity-20 
                    transition bg-indigo-400 rounded-lg blur-md
                  `}
                ></span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-indigo-600 mt-auto">
          <button
            onClick={handleLogout}
            className="w-full py-3 px-4 cursor-pointer rounded-lg bg-black-400 text-white font-medium hover:bg-black-700 transition"
          >
            Logout
          </button>
          <p className="text-center text-gray-300 text-sm mt-3">
            © {new Date().getFullYear()} Hospital Admin
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 bg-gray-50">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
