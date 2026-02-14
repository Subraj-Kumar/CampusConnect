import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Components
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Events from "./pages/Events";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EventDetails from "./pages/EventDetails";
import AdminDashboard from "./pages/AdminDashboard";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import EventAttendees from "./pages/EventAttendees"; // NEW: Added for Day 19
import Profile from "./pages/Profile";

function App() {
  return (
    <Router>
      {/* The Layout wrapper ensures Navbar and global styling appear on every page */}
      <Layout>
        <Routes>
          {/* --- 1. Public Discovery Routes --- */}
          <Route path="/" element={<Events />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/events/:id" element={<EventDetails />} />

          {/* --- 2. Shared Authenticated Routes --- */}
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />

          {/* --- 3. Student Dashboard (Personalized Enrollment) --- */}
          <Route 
            path="/student" 
            element={
              <ProtectedRoute role="student">
                <StudentDashboard />
              </ProtectedRoute>
            } 
          />

          {/* --- 4. Organizer Workflow (Event Creation & Management) --- */}
          <Route 
            path="/organizer" 
            element={
              <ProtectedRoute role="organizer">
                <OrganizerDashboard />
              </ProtectedRoute>
            } 
          />

          {/* --- 5. NEW: Attendee List (Organizer Only) --- */}
          <Route 
            path="/organizer/event/:id" 
            element={
              <ProtectedRoute role="organizer">
                <EventAttendees />
              </ProtectedRoute>
            } 
          />

          {/* --- 6. Admin Panel (Moderation & Security) --- */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />

          {/* --- 7. 404 Fallback --- */}
          <Route 
            path="*" 
            element={
              <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
                <h1 className="text-6xl font-black text-gray-200">404</h1>
                <p className="text-xl font-bold text-gray-500 mt-4">Page Not Found</p>
              </div>
            } 
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;