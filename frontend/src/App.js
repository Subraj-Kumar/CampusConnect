import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "react-calendar/dist/Calendar.css";

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
import EventAttendees from "./pages/EventAttendees";
import EditEvent from "./pages/EditEvent"; // 🚀 NEW IMPORT
import Profile from "./pages/Profile";
import OAuthSuccess from "./pages/OAuthSuccess";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* --- 1. Public Discovery Routes --- */}
          <Route path="/" element={<Events />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/oauth-success" element={<OAuthSuccess />} />

          {/* --- 2. Shared Authenticated Routes --- */}
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />

          {/* --- 3. Student Dashboard --- */}
          <Route 
            path="/student" 
            element={
              <ProtectedRoute role="student">
                <StudentDashboard />
              </ProtectedRoute>
            } 
          />

          {/* --- 4. Organizer Workflow --- */}
          <Route 
            path="/organizer" 
            element={
              <ProtectedRoute role="organizer">
                <OrganizerDashboard />
              </ProtectedRoute>
            } 
          />

          {/* 🚀 NEW ROUTE: Edit Event (Organizer Only) */}
          <Route 
            path="/organizer/edit-event/:id" 
            element={
              <ProtectedRoute role="organizer">
                <EditEvent />
              </ProtectedRoute>
            } 
          />

          {/* --- 5. Attendee List --- */}
          <Route 
            path="/organizer/event/:id" 
            element={
              <ProtectedRoute role="organizer">
                <EventAttendees />
              </ProtectedRoute>
            } 
          />

          {/* --- 6. Admin Panel --- */}
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