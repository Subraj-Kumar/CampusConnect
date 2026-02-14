import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";

const StudentDashboard = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const { data } = await API.get("/events/my/registrations");
        setRegistrations(data);
      } catch (error) {
        console.error("Error fetching registrations:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRegistrations();
  }, []);

  const today = new Date();

  // Defensive filtering: Ensure the event object exists before comparing dates
  const upcoming = registrations.filter(
    (r) => r.event && new Date(r.event.date) >= today
  );

  const past = registrations.filter(
    (r) => r.event && new Date(r.event.date) < today
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 animate-pulse text-xl">Loading your schedule...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-8">
      <header className="mb-10 border-b pb-6">
        <h1 className="text-4xl font-extrabold text-gray-900">My Student Dashboard</h1>
        <p className="text-gray-500 mt-2">Manage your registered events and past attendance.</p>
      </header>

      {/* UPCOMING SECTION */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-blue-600 mb-6 flex items-center gap-3">
          <span className="bg-blue-100 p-2 rounded-lg">📅</span> 
          Upcoming Events ({upcoming.length})
        </h2>
        
        {upcoming.length === 0 ? (
          <div className="bg-blue-50 border-2 border-dashed border-blue-200 rounded-2xl p-12 text-center">
            <p className="text-blue-700 font-medium mb-4">You haven't registered for any upcoming events.</p>
            <Link to="/" className="text-blue-600 font-bold underline hover:text-blue-800">
              Browse Events →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcoming.map((r) => (
              <div key={r._id} className="bg-white border border-gray-100 shadow-xl p-6 rounded-2xl flex justify-between items-center hover:shadow-2xl transition-shadow border-l-8 border-l-blue-600">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{r.event?.title}</h3>
                  <div className="text-sm text-gray-600 mt-3 space-y-1">
                    <p className="flex items-center gap-2">📍 {r.event?.venue}</p>
                    <p className="flex items-center gap-2">⏰ {new Date(r.event?.date).toLocaleDateString()} at {r.event?.time}</p>
                  </div>
                </div>
                <Link 
                  to={`/events/${r.event?._id}`}
                  className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-600 hover:text-white transition"
                >
                  Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* PAST SECTION */}
      <section>
        <h2 className="text-2xl font-bold text-gray-400 mb-6 flex items-center gap-3">
          <span className="bg-gray-100 p-2 rounded-lg">⏮️</span> 
          Past Attendance ({past.length})
        </h2>
        
        {past.length === 0 ? (
          <p className="text-gray-400 italic">No past events recorded.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 opacity-70">
            {past.map((r) => (
              <div key={r._id} className="bg-gray-50 border border-gray-200 p-4 rounded-xl grayscale hover:grayscale-0 transition duration-500">
                <h3 className="font-bold text-gray-700 truncate">{r.event?.title}</h3>
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(r.event?.date).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default StudentDashboard;