import { useState, useEffect } from "react";
import API from "../api/axios";

const AdminDashboard = () => {
  const [pendingEvents, setPendingEvents] = useState([]);
  const [pendingOrganizers, setPendingOrganizers] = useState([]);
  const [activeTab, setActiveTab] = useState("events"); // 'events' or 'organizers'
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch both pending events and pending organizers simultaneously
      const [eventsRes, orgsRes] = await Promise.all([
        API.get("/events/admin/pending"), // Adjust if your route is different
        API.get("/auth/admin/organizers/pending")
      ]);
      setPendingEvents(eventsRes.data);
      setPendingOrganizers(orgsRes.data);
    } catch (error) {
      console.error("Failed to fetch admin data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- EVENT HANDLERS ---
  const approveEvent = async (id) => {
    try {
      await API.put(`/events/${id}/approve`);
      setPendingEvents(pendingEvents.filter((e) => e._id !== id));
    } catch (error) {
      alert("Failed to approve event");
    }
  };

  const rejectEvent = async (id) => {
    try {
      await API.delete(`/events/${id}/reject`);
      setPendingEvents(pendingEvents.filter((e) => e._id !== id));
    } catch (error) {
      alert("Failed to reject event");
    }
  };

  // --- ORGANIZER HANDLERS ---
  const approveOrganizer = async (id) => {
    try {
      await API.put(`/auth/admin/organizers/${id}/approve`);
      setPendingOrganizers(pendingOrganizers.filter((o) => o._id !== id));
    } catch (error) {
      alert("Failed to approve organizer");
    }
  };

  const rejectOrganizer = async (id) => {
    if(window.confirm("Are you sure? This will delete the user account.")) {
      try {
        await API.delete(`/auth/admin/organizers/${id}/reject`);
        setPendingOrganizers(pendingOrganizers.filter((o) => o._id !== id));
      } catch (error) {
        alert("Failed to reject organizer");
      }
    }
  };

  if (loading) return <div className="text-center py-20 font-bold text-gray-500 animate-pulse">Loading secure dashboard...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10">
      <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-8">Admin Control Panel</h1>

      {/* TAB NAVIGATION */}
      <div className="flex gap-4 mb-8 border-b border-gray-200 pb-4">
        <button 
          onClick={() => setActiveTab("events")}
          className={`px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === "events" ? "bg-blue-600 text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
        >
          Pending Events ({pendingEvents.length})
        </button>
        <button 
          onClick={() => setActiveTab("organizers")}
          className={`px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === "organizers" ? "bg-gray-900 text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
        >
          Pending Organizers ({pendingOrganizers.length})
        </button>
      </div>

      {/* TAB CONTENT: EVENTS */}
      {activeTab === "events" && (
        <div className="space-y-6">
          {pendingEvents.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-3xl border border-gray-100 text-gray-500 font-medium">No pending events. You're all caught up!</div>
          ) : (
            pendingEvents.map((event) => (
              <div key={event._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                  <h3 className="text-xl font-black text-gray-900">{event.title}</h3>
                  <p className="text-gray-500 mt-1">By: {event.organizationName} | Date: {new Date(event.date).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                  <button onClick={() => approveEvent(event._id)} className="flex-1 md:flex-none px-6 py-2.5 bg-green-50 text-green-700 font-bold rounded-xl hover:bg-green-600 hover:text-white transition-all">Approve</button>
                  <button onClick={() => rejectEvent(event._id)} className="flex-1 md:flex-none px-6 py-2.5 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-600 hover:text-white transition-all">Reject</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB CONTENT: ORGANIZERS */}
      {activeTab === "organizers" && (
        <div className="space-y-6">
          {pendingOrganizers.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-3xl border border-gray-100 text-gray-500 font-medium">No pending organizers.</div>
          ) : (
            pendingOrganizers.map((org) => (
              <div key={org._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-black text-gray-900">{org.name}</h3>
                    <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-black uppercase tracking-wider rounded-lg">Organizer</span>
                  </div>
                  <p className="text-gray-500 mt-1">Email: {org.email} | Organization: {org.organization || "N/A"}</p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                  <button onClick={() => approveOrganizer(org._id)} className="flex-1 md:flex-none px-6 py-2.5 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-all">Approve Account</button>
                  <button onClick={() => rejectOrganizer(org._id)} className="flex-1 md:flex-none px-6 py-2.5 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-600 hover:text-white transition-all">Deny & Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;