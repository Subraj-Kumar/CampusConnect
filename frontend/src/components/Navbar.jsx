import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/"); // Redirect to landing page after logout
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300">
      <div className="max-w-[1400px] mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* Brand Logo - Gradient Text */}
        <Link to="/" className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 tracking-tight hover:opacity-80 transition">
          CampusConnect
        </Link>

        <div className="flex items-center gap-6">
          {!user ? (
            /* PUBLIC VIEW: Premium Login Button */
            <Link to="/login">
              <button className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition duration-200 shadow-md hover:shadow-lg active:scale-95 tracking-wide">
                Login
              </button>
            </Link>
          ) : (
            /* AUTHENTICATED VIEW: Role-Based Navigation */
            <div className="flex items-center gap-6">
              
              {/* 1. DYNAMIC DASHBOARD LINKS */}
              <div className="flex items-center gap-5 border-r pr-6 border-gray-200">
                {user.role === "student" && (
                  <Link to="/student" className="text-sm font-bold text-gray-600 hover:text-blue-600 transition tracking-wide">
                    My Events
                  </Link>
                )}

                {user.role === "organizer" && (
                  <Link to="/organizer" className="text-sm font-bold text-gray-600 hover:text-green-600 transition tracking-wide">
                    Organizer Dashboard
                  </Link>
                )}

                {user.role === "admin" && (
                  <Link to="/admin" className="text-sm font-bold text-gray-600 hover:text-red-600 transition tracking-wide">
                    Admin Panel
                  </Link>
                )}
              </div>

              {/* 2. USER PROFILE & IDENTITY */}
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-gray-900 leading-none">{user.name}</p>
                  <p className="text-[10px] text-blue-500 uppercase font-black tracking-widest mt-1">
                    {user.role}
                  </p>
                </div>

                {/* Profile Link with Circle Icon */}
                <Link 
                  to="/profile" 
                  className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center hover:bg-gray-200 transition border border-gray-200 shadow-sm"
                  title="View Profile"
                >
                  <span className="text-lg">👤</span>
                </Link>
              </div>

              {/* 3. LOGOUT */}
              <button 
                onClick={handleLogout} 
                className="text-xs font-black text-gray-400 hover:text-red-500 uppercase tracking-wider transition ml-2"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;