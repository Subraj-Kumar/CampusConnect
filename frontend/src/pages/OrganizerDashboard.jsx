import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Hook for navigation
import API from "../api/axios";

const OrganizerDashboard = () => {
  const navigate = useNavigate(); // Initialize navigation
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Workshop",
    date: "",
    time: "",
    venue: "",
    registrationDeadline: ""
  });

  // Fetch organizer-specific events with registration counts
  const fetchMyEvents = async () => {
    try {
      const { data } = await API.get("/events/my/events");
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await API.post("/events", formData);
      alert("Event created successfully and sent for admin approval!");
      
      // Reset form fields after successful creation
      setFormData({
        title: "",
        description: "",
        category: "Workshop",
        date: "",
        time: "",
        venue: "",
        registrationDeadline: ""
      });
      fetchMyEvents();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create event");
    }
  };

  return (
    <div className="space-y-12">
      {/* SECTION 1: CREATE EVENT FORM */}
      <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div className="mb-8">
          <h2 className="text-3xl font-black text-gray-800">Create New Event</h2>
          <p className="text-gray-500">Launch a new initiative for the campus community.</p>
        </div>

        <form onSubmit={submitHandler} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Event Title</label>
              <input
                className="w-full p-3 bg-gray-50 border-transparent border focus:border-blue-500 focus:bg-white rounded-xl outline-none transition"
                placeholder="e.g. Web Development Workshop"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Category</label>
              <select
                className="w-full p-3 bg-gray-50 border-transparent border focus:border-blue-500 focus:bg-white rounded-xl outline-none transition"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="Workshop">Workshop</option>
                <option value="Talk">Talk</option>
                <option value="Hackathon">Hackathon</option>
                <option value="Seminar">Seminar</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Date</label>
              <input
                type="date"
                className="w-full p-3 bg-gray-50 border-transparent border focus:border-blue-500 focus:bg-white rounded-xl outline-none transition"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Time</label>
              <input
                className="w-full p-3 bg-gray-50 border-transparent border focus:border-blue-500 focus:bg-white rounded-xl outline-none transition"
                placeholder="e.g. 10:00 AM"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Venue</label>
              <input
                className="w-full p-3 bg-gray-50 border-transparent border focus:border-blue-500 focus:bg-white rounded-xl outline-none transition"
                placeholder="e.g. Main Auditorium, Block A"
                value={formData.venue}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Description</label>
              <textarea
                className="w-full p-3 bg-gray-50 border-transparent border focus:border-blue-500 focus:bg-white rounded-xl outline-none transition h-32"
                placeholder="Provide details about the event goals, speakers, and requirements..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full md:w-auto px-10 py-4 bg-gray-900 text-white font-black rounded-2xl hover:bg-black transition shadow-xl active:scale-95"
          >
            Deploy Event
          </button>
        </form>
      </section>

      {/* SECTION 2: MANAGED EVENTS */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-black text-gray-800 tracking-tight">Managed Events</h2>
          <div className="bg-gray-100 px-4 py-2 rounded-full text-xs font-bold text-gray-500 uppercase tracking-widest">
            {events.length} Total
          </div>
        </div>

        {loading ? (
          <p className="text-center text-gray-400 py-20 animate-pulse">Syncing events...</p>
        ) : events.length === 0 ? (
          <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl p-20 text-center">
            <p className="text-gray-400 font-bold">You haven't created any events yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <div key={event._id} className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      event.isApproved ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"
                    }`}>
                      {event.isApproved ? "Approved ✅" : "Pending ⏳"}
                    </span>
                    <div className="text-[10px] font-bold text-gray-300 uppercase">{event.category}</div>
                  </div>

                  <h4 className="text-2xl font-bold text-gray-800 leading-tight mb-4">{event.title}</h4>
                  
                  <div className="space-y-2 mb-8 text-sm text-gray-400">
                    <p>📅 {new Date(event.date).toLocaleDateString()}</p>
                    <p>📍 {event.venue}</p>
                  </div>
                </div>

                {/* ANALYTICS SECTION */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-black text-blue-600">
                      {event.registrationCount || 0}
                    </span>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter leading-none">
                      Student <br /> Registrations
                    </p>
                  </div>
                  
                  {/* Functional Attendee List Button */}
                  <button 
                    onClick={() => navigate(`/organizer/event/${event._id}`)}
                    className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-100"
                  >
                    View List →
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

export default OrganizerDashboard;