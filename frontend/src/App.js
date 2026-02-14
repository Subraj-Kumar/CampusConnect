import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Components
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Events from "./pages/Events";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EventDetails from "./pages/EventDetails";
import AdminDashboard from "./pages/AdminDashboard";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import StudentDashboard from "./pages/StudentDashboard"; // FIXED: Added this import
import Profile from "./pages/Profile";

function App() {
  return (
    <Router>
      {/* Navbar is outside Routes so it shows on every page */}
      <Navbar /> 
      
      <div className="container mx-auto">
        <Routes>
          {/* --- Public Routes --- */}
          <Route path="/" element={<Events />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/events/:id" element={<EventDetails />} />

          {/* --- Secure Profile Route (Any logged-in user) --- */}
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />

          {/* --- Student Specific Route (FIXED: Added this block) --- */}
          <Route 
            path="/student" 
            element={
              <ProtectedRoute role="student">
                <StudentDashboard />
              </ProtectedRoute>
            } 
          />

          {/* --- Organizer Specific Routes --- */}
          <Route 
            path="/organizer" 
            element={
              <ProtectedRoute role="organizer">
                <OrganizerDashboard />
              </ProtectedRoute>
            } 
          />

          {/* --- Admin Specific Routes --- */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />

          {/* --- 404 Catch-all --- */}
          <Route path="*" element={<div className="p-10 text-center text-2xl font-bold">404 - Page Not Found</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;