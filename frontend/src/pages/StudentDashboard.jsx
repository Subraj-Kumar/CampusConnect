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

  const upcoming = registrations.filter(
    (r) => r.event && new Date(r.event.date) >= today
  );

  const past = registrations.filter(
    (r) => r.event && new Date(r.event.date) < today
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto p-6 md:p-10 min-h-screen">
      <header className="mb-10 bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">My Student Dashboard</h1>
          <p className="text-gray-500 mt-2 font-medium">Manage your registered events and past attendance.</p>
        </div>
        <div className="hidden md:block bg-blue-50 px-6 py-3 rounded-xl border border-blue-100">
          <p className="text-blue-600 font-bold text-sm">Total Registrations: {registrations.length}</p>
        </div>
      </header>

      {/* UPCOMING SECTION */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <span className="bg-blue-100 text-blue-600 p-2.5 rounded-xl shadow-sm">📅</span> 
          Upcoming Events ({upcoming.length})
        </h2>
        
        {upcoming.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-16 text-center shadow-sm">
            <p className="text-gray-500 font-medium mb-4 text-lg">You haven't registered for any upcoming events.</p>
            <Link to="/" className="inline-block bg-blue-600 text-white font-bold px-6 py-3 rounded-xl shadow-md hover:bg-blue-700 hover:-translate-y-1 transition-all">
              Browse Events →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcoming.map((r) => (
              <div key={r._id} className="bg-white border border-gray-100 shadow-sm p-6 rounded-2xl flex flex-col justify-between hover:shadow-xl transition-all duration-300 border-l-4 border-l-blue-600 group">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 line-clamp-2">{r.event?.title}</h3>
                  <div className="text-sm text-gray-500 space-y-2 font-medium">
                    <p className="flex items-center gap-2">📍 {r.event?.venue}</p>
                    <p className="flex items-center gap-2">⏰ {new Date(r.event?.date).toLocaleDateString()} at {r.event?.time}</p>
                  </div>
                </div>
                <Link 
                  to={`/events/${r.event?._id}`}
                  className="block text-center bg-gray-50 text-gray-700 w-full py-3 rounded-xl text-sm font-bold hover:bg-blue-600 hover:text-white transition-colors border border-gray-200"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* PAST SECTION */}
      <section>
        <h2 className="text-2xl font-bold text-gray-500 mb-6 flex items-center gap-3">
          <span className="bg-gray-200 p-2.5 rounded-xl shadow-sm">⏮️</span> 
          Past Attendance ({past.length})
        </h2>
        
        {past.length === 0 ? (
          <p className="text-gray-400 italic font-medium">No past events recorded.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {past.map((r) => (
              <div key={r._id} className="bg-white border border-gray-200 p-5 rounded-2xl opacity-75 hover:opacity-100 transition-opacity duration-300 shadow-sm">
                <h3 className="font-bold text-gray-700 truncate">{r.event?.title}</h3>
                <p className="text-xs font-bold text-gray-400 mt-2 uppercase tracking-wider">
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