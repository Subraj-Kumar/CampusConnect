import { useEffect, useState, useContext } from "react";
import API from "../api/axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Events = () => {
  const { user } = useContext(AuthContext);

  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("asc");
  const [loadingId, setLoadingId] = useState(null);
  
  // Day 17: State to track which events the student has already joined
  const [registeredMap, setRegisteredMap] = useState({});

  const fetchEvents = async () => {
    try {
      const { data } = await API.get(
        `/events?search=${search}&category=${category}&sort=${sort}`
      );
      setEvents(data);

      // Day 17: If a student is logged in, check registration status for all fetched events
      if (user?.role === "student") {
        const statuses = await Promise.all(
          data.map(async (event) => {
            try {
              const res = await API.get(`/events/${event._id}/registration-status`);
              return { id: event._id, isRegistered: res.data.registered };
            } catch (err) {
              return { id: event._id, isRegistered: false };
            }
          })
        );

        const statusMap = {};
        statuses.forEach((item) => (statusMap[item.id] = item.isRegistered));
        setRegisteredMap(statusMap);
      }
    } catch (error) {
      console.error("Error fetching events", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [search, category, sort, user]); // Refetch if user logs in/out

  const registerHandler = async (eventId) => {
    try {
      setLoadingId(eventId);
      await API.post(`/events/${eventId}/register`);
      
      // Day 17: Instant UI Update - mark as registered in local state
      setRegisteredMap((prev) => ({ ...prev, [eventId]: true }));
      
      alert("Registered successfully!");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Upcoming Events</h1>
      </div>

      {/* SEARCH & FILTERS */}
      <div className="flex flex-wrap gap-4 mb-10 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <input
          type="text"
          placeholder="Search by title..."
          className="border-gray-200 border p-3 rounded-xl w-full md:w-80 focus:ring-2 focus:ring-blue-500 outline-none transition"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border-gray-200 border p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="All">All Categories</option>
          <option value="Workshop">Workshop</option>
          <option value="Talk">Talk</option>
          <option value="Hackathon">Hackathon</option>
          <option value="Seminar">Seminar</option>
          <option value="Other">Other</option>
        </select>

        <select
          className="border-gray-200 border p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="asc">📅 Date: Soonest First</option>
          <option value="desc">📅 Date: Furthest First</option>
        </select>
      </div>

      {/* EVENT GRID */}
      {events.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg italic">No events found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
            >
              {/* Day 21: POSTER DISPLAY (Step 9) */}
              {event.poster ? (
                <img
                  src={event.poster}
                  alt={`${event.title} Poster`}
                  className="w-full h-48 object-cover rounded-2xl mb-4"
                />
              ) : (
                /* Fallback if no poster is available */
                <div className="w-full h-48 bg-gray-50 rounded-2xl mb-4 flex items-center justify-center border border-gray-100">
                   <span className="text-gray-300 text-sm font-bold uppercase tracking-tighter">No Preview Available</span>
                </div>
              )}

              <div className="flex justify-between items-start mb-4">
                <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full">
                  {event.category}
                </span>
                {/* Visual indicator of registration status */}
                {user?.role === "student" && registeredMap[event._id] && (
                  <span className="text-green-500 font-bold text-xs flex items-center gap-1">
                    ✓ Joined
                  </span>
                )}
              </div>

              <h3 className="text-2xl font-bold text-gray-800 leading-tight mb-2">{event.title}</h3>

              <p className="text-gray-500 text-sm line-clamp-2 mb-6 h-10">
                {event.description}
              </p>

              <div className="space-y-2 mb-6">
                <div className="flex items-center text-gray-400 text-xs font-medium">
                  <span className="mr-2">📅</span> {new Date(event.date).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
                <div className="flex items-center text-gray-400 text-xs font-medium">
                  <span className="mr-2">📍</span> {event.venue}
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="space-y-3">
                <Link to={`/events/${event._id}`} className="block">
                  <button className="w-full bg-gray-50 text-gray-800 font-bold py-3 rounded-xl hover:bg-gray-100 transition">
                    View Details
                  </button>
                </Link>

                {/* Conditional Register/Registered Logic */}
                {!user ? (
                  <Link to="/login" className="block">
                    <button className="w-full bg-gray-800 text-white font-bold py-3 rounded-xl hover:bg-black transition shadow-lg">
                      Login to Register
                    </button>
                  </Link>
                ) : user.role === "student" ? (
                  registeredMap[event._id] ? (
                    <button
                      disabled
                      className="w-full bg-blue-50 text-blue-600 font-bold py-3 rounded-xl border border-blue-100 cursor-default"
                    >
                      Registered ✅
                    </button>
                  ) : (
                    <button
                      onClick={() => registerHandler(event._id)}
                      disabled={loadingId === event._id}
                      className="w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition shadow-lg disabled:opacity-50 active:scale-95"
                    >
                      {loadingId === event._id ? "Processing..." : "Register Now"}
                    </button>
                  )
                ) : (
                  <div className="text-center text-[10px] font-bold text-gray-300 uppercase tracking-widest pt-2">
                    {user.role} Control Mode
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;