import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/"); // Redirect to home after logout
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      
      {/* Brand Logo */}
      <Link to="/" className="text-2xl font-extrabold text-blue-600 tracking-tight hover:opacity-80 transition">
        CampusConnect
      </Link>

      <div className="flex items-center gap-4">
        {!user ? (
          /* Public View: Only show Login */
          <Link to="/login">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition shadow-md active:scale-95">
              Login
            </button>
          </Link>
        ) : (
          /* Authenticated View: User Info + Dynamic Links */
          <div className="flex items-center gap-4">
            
            {/* User Identity Display */}
            <div className="text-right mr-2 hidden sm:block">
              <p className="text-sm font-bold text-gray-800 leading-none">{user.name}</p>
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mt-1">
                {user.role}
              </p>
            </div>

            {/* DYNAMIC DASHBOARD LINKS BASED ON ROLE */}
            {user.role === "student" && (
              <Link to="/student" className="text-sm font-semibold text-blue-600 hover:text-blue-800">
                My Events
              </Link>
            )}

            {user.role === "organizer" && (
              <Link to="/organizer" className="text-sm font-semibold text-green-600 hover:text-green-800">
                Dashboard
              </Link>
            )}

            {user.role === "admin" && (
              <Link to="/admin" className="text-sm font-semibold text-red-600 hover:text-red-800">
                Admin Panel
              </Link>
            )}

            {/* SHARED PROTECTED LINKS */}
            <Link to="/profile" className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition" title="My Profile">
              👤
            </Link>

            <button 
              onClick={handleLogout} 
              className="text-sm font-bold text-gray-600 hover:text-red-500 transition border-l pl-4 border-gray-300"
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