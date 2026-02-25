import { useEffect, useState } from "react";
import API from "../api/axios";

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingEvents = async () => {
    try {
      const { data } = await API.get("/admin/events/pending");
      setEvents(data);
    } catch (error) {
      console.error("Failed to fetch pending events", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingEvents();
  }, []);

  const approveEvent = async (id) => {
    try {
      await API.put(`/admin/events/${id}/approve`);
      fetchPendingEvents();
    } catch (error) {
      alert("Failed to approve event");
    }
  };

  const rejectEvent = async (id) => {
    if (window.confirm("Are you sure you want to completely reject and delete this event?")) {
      try {
        await API.delete(`/admin/events/${id}/reject`);
        fetchPendingEvents();
      } catch (error) {
        alert("Failed to reject event");
      }
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto p-6 md:p-10 min-h-screen">
      
      {/* HEADER SECTION */}
      <header className="mb-10 bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Admin Moderation Panel</h1>
          <p className="text-gray-500 mt-2 font-medium">Review and approve events submitted by organizers.</p>
        </div>
        <div className="hidden md:flex items-center gap-3 bg-yellow-50 px-6 py-3 rounded-xl border border-yellow-100">
          <span className="text-xl">⚠️</span>
          <p className="text-yellow-700 font-bold text-sm">{events.length} Pending Approval</p>
        </div>
      </header>

      {/* MODERATION QUEUE */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <span className="bg-gray-100 p-2.5 rounded-xl shadow-sm">📥</span> 
          Pending Event Queue
        </h2>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-400"></div>
          </div>
        ) : events.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-16 text-center shadow-sm">
            <p className="text-green-600 font-bold text-xl mb-2">Queue is empty! 🎉</p>
            <p className="text-gray-500 font-medium text-sm">All organizer submissions have been reviewed.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div key={event._id} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col justify-between">
                
                <div className="mb-6">
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-yellow-100 text-yellow-700 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                      Action Required
                    </span>
                    <span className="text-xs font-bold text-gray-400 uppercase">{event.category}</span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                    {event.description}
                  </p>

                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-2 text-sm font-medium text-gray-700">
                    <p className="flex items-center gap-2"><span className="text-gray-400">👤 Organizer:</span> {event.organizer?.name}</p>
                    <p className="flex items-center gap-2"><span className="text-gray-400">📅 Date:</span> {new Date(event.date).toLocaleDateString()}</p>
                    <p className="flex items-center gap-2"><span className="text-gray-400">📍 Venue:</span> {event.venue}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
                  <button 
                    onClick={() => rejectEvent(event._id)} 
                    className="w-full py-2.5 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-600 hover:text-white transition-colors border border-red-100 text-sm"
                  >
                    Reject & Delete
                  </button>
                  <button 
                    onClick={() => approveEvent(event._id)} 
                    className="w-full py-2.5 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-colors shadow-md shadow-green-200 text-sm"
                  >
                    Approve Event
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminDashboard;