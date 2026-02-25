import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import API from "../api/axios";

const OrganizerDashboard = () => {
  const navigate = useNavigate(); 
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [poster, setPoster] = useState(null);

  // 🚀 UPDATED: Added externalFormUrl and hasRefreshments to initial state
  const [formData, setFormData] = useState({
    title: "", description: "", category: "Workshop", date: "", time: "", venue: "", registrationDeadline: "",
    externalFormUrl: "", hasRefreshments: false 
  });

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
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });
    if (poster) data.append("poster", poster);

    try {
      await API.post("/events", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      alert("Event created successfully!");
      
      // 🚀 UPDATED: Reset the new fields after successful submission
      setFormData({
        title: "", description: "", category: "Workshop", date: "", time: "", venue: "", registrationDeadline: "",
        externalFormUrl: "", hasRefreshments: false
      });
      setPoster(null);
      fetchMyEvents();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create event");
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto p-6 md:p-10 space-y-12">
      {/* SECTION 1: CREATE EVENT FORM */}
      <section className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100">
        <div className="mb-10">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">Create New Event</h2>
          <p className="text-gray-500 font-medium mt-2">Launch a new initiative for the campus community.</p>
        </div>

        <form onSubmit={submitHandler} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Event Title</label>
              <input
                className="w-full p-4 bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl outline-none transition"
                placeholder="e.g. Web Development Workshop"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Category</label>
              <select
                className="w-full p-4 bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl outline-none transition cursor-pointer"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="Workshop">Workshop</option>
                <option value="Talk">Talk</option>
                <option value="Hackathon">Hackathon</option>
                <option value="Seminar">Seminar</option>
                <option value="Sports">Sports</option>
                <option value="Technical">Technical</option>
                <option value="Recreational">Recreational</option>
                <option value="Cultural">Cultural</option>
                <option value="Event">Event</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Date</label>
              <input
                type="date"
                className="w-full p-4 bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl outline-none transition"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Time</label>
              <input
                className="w-full p-4 bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl outline-none transition"
                placeholder="e.g. 10:00 AM"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Event Poster (Optional)</label>
              <input
                type="file"
                accept="image/*"
                className="w-full p-4 bg-gray-50 border-dashed border-2 border-gray-300 rounded-xl outline-none transition cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                onChange={(e) => setPoster(e.target.files[0])}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Venue</label>
              <input
                className="w-full p-4 bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl outline-none transition"
                placeholder="e.g. Main Auditorium, Block A"
                value={formData.venue}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Description</label>
              <textarea
                className="w-full p-4 bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl outline-none transition h-32 resize-none"
                placeholder="Provide details about the event goals, speakers, and requirements..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            {/* 🚀 NEW: GOOGLE FORM LINK */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-blue-600 ml-1">External Registration (Google Form / Link)</label>
              <input
                className="w-full p-4 bg-blue-50 border border-blue-100 focus:border-blue-500 rounded-xl outline-none transition"
                value={formData.externalFormUrl}
                onChange={(e) => setFormData({ ...formData, externalFormUrl: e.target.value })}
                placeholder="https://forms.gle/..."
              />
            </div>

            {/* 🚀 NEW: REFRESHMENTS TOGGLE */}
            <div className="md:col-span-2 flex items-center gap-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
              <input
                type="checkbox"
                className="w-5 h-5 accent-blue-600 cursor-pointer"
                checked={formData.hasRefreshments}
                onChange={(e) => setFormData({ ...formData, hasRefreshments: e.target.checked })}
                id="refreshments"
              />
              <label htmlFor="refreshments" className="font-bold text-gray-700 cursor-pointer select-none">
                Will refreshments be provided? 🥤🍕
              </label>
            </div>

          </div>

          <button 
            type="submit" 
            className="w-full md:w-auto px-10 py-4 bg-gray-900 text-white font-black rounded-xl hover:bg-blue-600 transition-colors shadow-lg active:scale-95"
          >
            Deploy Event
          </button>
        </form>
      </section>

      {/* SECTION 2: MANAGED EVENTS */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Managed Events</h2>
          <div className="bg-gray-200 px-4 py-1.5 rounded-full text-xs font-black text-gray-600 uppercase tracking-widest">
            {events.length} Total
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-400"></div>
          </div>
        ) : events.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-20 text-center shadow-sm">
            <p className="text-gray-500 font-medium text-lg">You haven't created any events yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <div key={event._id} className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      event.isApproved ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {event.isApproved ? "Approved ✅" : "Pending ⏳"}
                    </span>
                    <div className="text-[10px] font-bold text-gray-400 uppercase bg-gray-50 px-2 py-1 rounded-md">{event.category}</div>
                  </div>

                  {event.poster && (
                    <img 
                      src={event.poster} 
                      alt="Event" 
                      className="w-full h-36 object-cover rounded-xl mb-4 border border-gray-100 group-hover:opacity-90 transition-opacity" 
                    />
                  )}

                  <h4 className="text-xl font-bold text-gray-900 leading-tight mb-3 line-clamp-2">{event.title}</h4>
                  
                  <div className="space-y-1 mb-6 text-sm text-gray-500 font-medium">
                    <p>📅 {new Date(event.date).toLocaleDateString()}</p>
                    <p className="truncate">📍 {event.venue}</p>
                    {/* Optional: Show tiny refreshment badge here if you want organizers to see it */}
                    {event.hasRefreshments && <p className="text-green-600 text-xs mt-1">🍕 Refreshments included</p>}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-5 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-black text-blue-600">
                      {event.registrationCount || 0}
                    </span>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tight leading-tight">
                      Student <br /> Registrations
                    </p>
                  </div>
                  
                  {/* 🚀 NEW: Button Group (Edit + View) */}
                  <div className="flex gap-2">
                    <button 
                      onClick={() => navigate(`/organizer/edit-event/${event._id}`)}
                      className="px-4 py-2.5 bg-yellow-50 text-yellow-700 text-sm font-bold rounded-xl hover:bg-yellow-500 hover:text-white transition-colors border border-yellow-100"
                    >
                      Edit ✏️
                    </button>
                    <button 
                      onClick={() => navigate(`/organizer/event/${event._id}`)}
                      className="px-4 py-2.5 bg-gray-50 text-gray-800 text-sm font-bold rounded-xl hover:bg-blue-600 hover:text-white transition-colors border border-gray-200"
                    >
                      View List
                    </button>
                  </div>
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