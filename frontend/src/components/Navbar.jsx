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
    <nav className="bg-white border-b border-gray-200 shadow-sm px-6 py-3 flex justify-between items-center sticky top-0 z-50">
      
      {/* Brand Logo - CampusConnect */}
      <Link to="/" className="text-2xl font-extrabold text-blue-600 tracking-tight hover:opacity-80 transition">
        CampusConnect
      </Link>

      <div className="flex items-center gap-6">
        {!user ? (
          /* PUBLIC VIEW: Only Login Button */
          <Link to="/login">
            <button className="bg-blue-600 text-white px-5 py-2 rounded-lg font-bold hover:bg-blue-700 transition shadow-sm active:scale-95">
              Login
            </button>
          </Link>
        ) : (
          /* AUTHENTICATED VIEW: Role-Based Navigation */
          <div className="flex items-center gap-6">
            
            {/* 1. DYNAMIC DASHBOARD LINKS */}
            <div className="flex items-center gap-4 border-r pr-6 border-gray-100">
              {user.role === "student" && (
                <Link to="/student" className="text-sm font-bold text-gray-600 hover:text-blue-600 transition">
                  My Events
                </Link>
              )}

              {user.role === "organizer" && (
                <Link to="/organizer" className="text-sm font-bold text-gray-600 hover:text-green-600 transition">
                  Organizer Dashboard
                </Link>
              )}

              {user.role === "admin" && (
                <Link to="/admin" className="text-sm font-bold text-gray-600 hover:text-red-600 transition">
                  Admin Panel
                </Link>
              )}
            </div>

            {/* 2. USER PROFILE & IDENTITY */}
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-800 leading-none">{user.name}</p>
                <p className="text-[10px] text-gray-400 uppercase font-extrabold tracking-widest mt-1">
                  {user.role}
                </p>
              </div>

              {/* Profile Link with Circle Icon */}
              <Link 
                to="/profile" 
                className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition border border-gray-200"
                title="View Profile"
              >
                <span className="text-lg">👤</span>
              </Link>
            </div>

            {/* 3. LOGOUT */}
            <button 
              onClick={handleLogout} 
              className="text-xs font-black text-gray-400 hover:text-red-500 uppercase tracking-tighter transition"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;