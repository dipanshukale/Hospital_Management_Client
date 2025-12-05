import type { ReactNode } from "react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../utils/auth";

interface User {
  name?: string;
  role?: string;
}

interface DoctorLayoutProps {
  children: ReactNode;
}

const DoctorLayout = ({ children }: DoctorLayoutProps) => {
  const navigate = useNavigate();
  const user: User = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (!user || user.role !== "doctor") {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Top Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

          {/* Left - Title */}
          <Link
            to="/doctor/dashboard"
            className="text-xl font-bold text-blue-700 tracking-wide hover:text-blue-800 transition"
          >
            Doctor Dashboard
          </Link>

          {/* Right - User + Logout */}
          <div className="flex items-center gap-4">
            <span className="text-gray-700 font-medium">
              Dr. {user.name || "Guest"}
            </span>

            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-red-500 text-white font-medium
              hover:bg-red-600 transition shadow-sm active:scale-95"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <main className="max-w-7xl mx-auto px-6 py-6">{children}</main>
    </div>
  );
};

export default DoctorLayout;
