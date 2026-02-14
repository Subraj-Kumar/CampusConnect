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

  const fetchEvents = async () => {
    try {
      const { data } = await API.get(
        `/events?search=${search}&category=${category}&sort=${sort}`
      );
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [search, category, sort]);

  const registerHandler = async (eventId) => {
    try {
      setLoadingId(eventId);
      await API.post(`/events/${eventId}/register`);
      alert("Registered successfully!");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Upcoming Events</h1>

      {/* SEARCH & FILTERS */}
      <div className="flex flex-wrap gap-4 mb-8 bg-gray-100 p-4 rounded-lg">
        <input
          type="text"
          placeholder="Search by title..."
          className="border p-2 rounded w-full md:w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border p-2 rounded"
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
          className="border p-2 rounded"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="asc">Date: Soonest First</option>
          <option value="desc">Date: Furthest First</option>
        </select>
      </div>

      {/* EVENT GRID */}
      {events.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">
          No events found matching your criteria.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event._id}
              className="border p-5 rounded-xl shadow-sm hover:shadow-md transition"
            >
              <span className="text-xs font-bold text-blue-600 uppercase">
                {event.category}
              </span>

              <h3 className="text-xl font-bold mt-1">{event.title}</h3>

              <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                {event.description}
              </p>

              <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
                <span>📅 {new Date(event.date).toLocaleDateString()}</span>
                <span>📍 {event.venue}</span>
              </div>

              {/* View Details */}
              <Link to={`/events/${event._id}`}>
                <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                  View Details
                </button>
              </Link>

              {/* REGISTER BUTTON (Conditional) */}
              {user ? (
                user.role === "student" && (
                  <button
                    onClick={() => registerHandler(event._id)}
                    disabled={loadingId === event._id}
                    className="w-full mt-3 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                  >
                    {loadingId === event._id
                      ? "Registering..."
                      : "Register"}
                  </button>
                )
              ) : (
                <Link to="/login">
                  <button className="w-full mt-3 bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500 transition">
                    Login to Register
                  </button>
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;
