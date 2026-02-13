import { useEffect, useState } from "react";
import API from "../api/axios";
import { Link } from "react-router-dom";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("asc");

  const fetchEvents = async () => {
    try {
      // Sending search, category, and sort as query parameters
      const { data } = await API.get(
        `/events?search=${search}&category=${category}&sort=${sort}`
      );
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events", error);
    }
  };

  // Re-run this effect whenever any of these 3 states change
  useEffect(() => {
    fetchEvents();
  }, [search, category, sort]);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Upcoming Events</h1>

      {/* SEARCH & FILTERS BAR */}
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
        <p className="text-center text-gray-500 mt-10">No events found matching your criteria.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event._id} className="border p-5 rounded-xl shadow-sm hover:shadow-md transition">
              <span className="text-xs font-bold text-blue-600 uppercase">{event.category}</span>
              <h3 className="text-xl font-bold mt-1">{event.title}</h3>
              <p className="text-gray-600 text-sm mt-2 line-clamp-2">{event.description}</p>
              
              <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
                <span>📅 {new Date(event.date).toLocaleDateString()}</span>
                <span>📍 {event.venue}</span>
              </div>

              <Link to={`/events/${event._id}`}>
                <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                  View Details
                </button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;