import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="text-center py-20 font-bold text-gray-500">Authenticating...</div>;
  
  if (!user) return <Navigate to="/login" replace />;

  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  // 🚀 NEW: The Bouncer for Organizers
  if (user.role === "organizer" && !user.isApproved) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="text-6xl mb-6">⏳</div>
        <h2 className="text-4xl font-black text-gray-900 tracking-tight">Account Pending</h2>
        <p className="text-lg text-gray-500 mt-4 max-w-md">
          Your organizer account has been created, but it requires Admin approval before you can access the dashboard and publish events.
        </p>
        <button 
          onClick={() => window.location.href = '/'}
          className="mt-8 px-6 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition"
        >
          Return Home
        </button>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;