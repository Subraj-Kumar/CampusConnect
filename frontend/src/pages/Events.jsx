import { useEffect, useState, useContext, useCallback } from "react";
import API from "../api/axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import UpcomingSlider from "../components/UpcomingSlider";
import EventCalendar from "../components/EventCalendar";

const Events = () => {
  const { user } = useContext(AuthContext);

  // Data States
  const [sliderEvents, setSliderEvents] = useState([]);
  const [gridEvents, setGridEvents] = useState([]); // Holds all non-slider events
  
  // Filter States
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("asc");
  
  // Logic States
  const [loadingId, setLoadingId] = useState(null);
  const [registeredMap, setRegisteredMap] = useState({});

  const fetchData = useCallback(async () => {
    let sliderData = [];

    try {
      const res = await API.get("/events/upcoming/slider");
      sliderData = res.data || [];
      setSliderEvents(sliderData);
    } catch (error) {
      console.warn("Slider endpoint issue:", error.message);
    }

    try {
      const { data: mainData } = await API.get(
        `/events?search=${search}&category=${category}&sort=${sort}`
      );

      // Filter: Prevent duplicate events by hiding slider events from the main grid
      const sliderIds = new Set(sliderData.map(e => String(e._id)));
      const filteredMain = mainData.filter(e => !sliderIds.has(String(e._id)));
      
      setGridEvents(filteredMain);

      if (user?.role === "student") {
        const allEvents = [...sliderData, ...filteredMain];
        if (allEvents.length > 0) {
          const statuses = await Promise.all(
            allEvents.map(async (event) => {
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
      }
    } catch (error) {
      console.error("Main event list failed:", error);
    }
  }, [search, category, sort, user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const registerHandler = async (eventId) => {
    try {
      setLoadingId(eventId);
      await API.post(`/events/${eventId}/register`);
      setRegisteredMap((prev) => ({ ...prev, [eventId]: true }));
      alert("Registered successfully!");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    } finally {
      setLoadingId(null);
    }
  };

  // 🔥 Split the grid events into Upcoming and Past based on backend's daysLeft calculation
  const upcomingEvents = gridEvents.filter(e => e.daysLeft >= 0);
  const pastEvents = gridEvents.filter(e => e.daysLeft < 0);

  return (
    <div className="events-page-container">
      <style>{styles}</style>

      {/* 🎯 UPGRADE 1: Premium Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl p-10 mb-10 shadow-xl transform transition hover:scale-[1.01] duration-300">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
          Discover Campus Events Effortlessly
        </h1>
        <p className="text-lg md:text-xl opacity-90 max-w-2xl font-light">
          Stay updated with workshops, talks, hackathons, and more — all in one place.
        </p>
      </div>

      {/* 🎞 HERO SLIDER */}
      {sliderEvents.length > 0 && (
        <div className="slider-section">
          <UpcomingSlider events={sliderEvents} />
        </div>
      )}

      {/* 🛠 CONTROLS HEADER */}
      <div className="controls-header">
        <div>
          <h1 className="page-title">Explore Events</h1>
          <p className="page-subtitle">Find what's happening around campus</p>
        </div>

        <div className="filters-wrapper shadow-sm">
          <input
            type="text"
            placeholder="Search by title..."
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select className="filter-select" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="All">All Categories</option>
            <option value="Workshop">Workshop</option>
            <option value="Talk">Talk</option>
            <option value="Hackathon">Hackathon</option>
            <option value="Seminar">Seminar</option>
            <option value="Other">Other</option>
          </select>

          <select className="filter-select" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="asc">📅 Soonest First</option>
            <option value="desc">📅 Furthest First</option>
          </select>
        </div>
      </div>

      {/* 🟢 TWO-COLUMN LAYOUT (Calendar + Upcoming Grid) */}
      <div className="homepage-main-grid">
        
        {/* LEFT COLUMN: Calendar Widget */}
        <aside>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
            <EventCalendar events={[...sliderEvents, ...gridEvents]} />
          </div>
        </aside>

        {/* RIGHT COLUMN: Upcoming Event Grid */}
        <main>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1.5rem', color: '#111827' }}>Upcoming Events</h2>
          <div className="events-grid">
            {upcomingEvents.length === 0 ? (
              <div className="empty-state">
                <p>No upcoming events match your criteria.</p>
              </div>
            ) : (
              upcomingEvents.map((event) => (
                <div key={event._id} className="event-card group">
                  <div>
                    <div className="card-image-wrapper">
                      {event.poster ? (
                        <img src={event.poster} alt={event.title} className="card-img group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="placeholder-img">No Preview</div>
                      )}
                      <span className="category-badge">{event.category}</span>
                    </div>

                    {user?.role === "student" && registeredMap[event._id] && (
                      <div className="registered-badge">✓ Registered</div>
                    )}

                    <h3 className="card-title">{event.title}</h3>
                    
                    {/* 🔥 Smart Time Indicator */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', marginBottom: '1rem', borderTop: '1px solid #f3f4f6', paddingTop: '1rem' }}>
                      <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#4b5563' }}>
                        📅 {new Date(event.date).toLocaleDateString("en-IN", { day: 'numeric', month: 'short' })}
                      </span>
                      <span style={{ fontSize: '0.875rem', fontWeight: 700, color: event.daysLeft === 0 ? '#ea580c' : '#059669', backgroundColor: event.daysLeft === 0 ? '#ffedd5' : '#d1fae5', padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>
                        {event.daysLeft === 0 ? "Today" : `Starts in ${event.daysLeft} day${event.daysLeft !== 1 ? "s" : ""}`}
                      </span>
                    </div>

                    <div className="meta-row">
                      <span>📍</span> {event.venue}
                    </div>
                  </div>

                  <div className="btn-group">
                    <Link to={`/events/${event._id}`} style={{ flex: 1, textDecoration: 'none' }}>
                      <button className="btn btn-details" style={{ width: '100%' }}>Details</button>
                    </Link>

                    {/* Auth / Registration Actions */}
                    {!user ? (
                      <Link to="/login" style={{ flex: 1, textDecoration: 'none' }}>
                        <button className="btn btn-register" style={{ backgroundColor: '#111827' }}>Login</button>
                      </Link>
                    ) : user.role === "student" ? (
                      <div style={{ flex: 1 }}>
                        {registeredMap[event._id] ? (
                          <button className="btn btn-joined" disabled>Joined</button>
                        ) : (
                          <button
                            onClick={() => registerHandler(event._id)}
                            disabled={loadingId === event._id}
                            className="btn btn-register"
                            style={{ opacity: loadingId === event._id ? 0.7 : 1 }}
                          >
                            {loadingId === event._id ? "..." : "Join"}
                          </button>
                        )}
                      </div>
                    ) : null}
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>

      {/* 🔥 PAST SECTION (Archive) */}
      {pastEvents.length > 0 && (
        <section style={{ marginTop: '5rem', paddingTop: '3rem', borderTop: '2px dashed #e5e7eb' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Past Events (Archive)
          </h2>
          <div className="events-grid">
            {pastEvents.map((event) => (
              <div key={event._id} className="event-card past-card">
                <div>
                  <div className="card-image-wrapper" style={{ height: '10rem', filter: 'grayscale(100%)', opacity: 0.6 }}>
                    {event.poster ? (
                      <img src={event.poster} alt={event.title} className="card-img" />
                    ) : (
                      <div className="placeholder-img">No Preview</div>
                    )}
                  </div>
                  
                  <h3 className="card-title" style={{ color: '#6b7280' }}>{event.title}</h3>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#9ca3af' }}>
                      📅 {new Date(event.date).toLocaleDateString("en-IN", { day: 'numeric', month: 'short' })}
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af', backgroundColor: '#f3f4f6', padding: '0.25rem 0.5rem', borderRadius: '0.5rem' }}>
                      Ended {Math.abs(event.daysLeft)} day{Math.abs(event.daysLeft) !== 1 && "s"} ago
                    </span>
                  </div>
                </div>

                <Link to={`/events/${event._id}`} style={{ textDecoration: 'none' }}>
                  <button className="btn btn-details" style={{ width: '100%', padding: '0.6rem', fontSize: '0.875rem' }}>View Archive</button>
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
};

// 🎨 Combined CSS Styles
const styles = `
  .events-page-container { max-width: 1400px; margin: 0 auto; padding: 2rem; font-family: 'Inter', system-ui, sans-serif; background-color: #f9fafb; min-height: 100vh; }
  .slider-section { margin-bottom: 4rem; }
  .controls-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 3rem; flex-wrap: wrap; gap: 1.5rem; }
  .page-title { font-size: 2.5rem; font-weight: 800; color: #111827; margin: 0; letter-spacing: -0.02em; }
  .page-subtitle { color: #6b7280; font-size: 1rem; font-weight: 500; margin-top: 0.5rem; }
  .filters-wrapper { display: flex; gap: 1rem; background: white; padding: 0.75rem; border-radius: 1rem; border: 1px solid #e5e7eb; flex-wrap: wrap; }
  .search-input { padding: 0.75rem 1.25rem; border: 1px solid #e5e7eb; border-radius: 0.75rem; min-width: 280px; outline: none; transition: all 0.2s; background-color: #f9fafb; }
  .search-input:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); background-color: white; }
  .filter-select { padding: 0.75rem 2.5rem 0.75rem 1.25rem; border: 1px solid #e5e7eb; border-radius: 0.75rem; background-color: #f9fafb; cursor: pointer; font-weight: 500; color: #374151; transition: all 0.2s; }
  .filter-select:hover { border-color: #d1d5db; }
  .homepage-main-grid { display: grid; grid-template-columns: 1fr; gap: 2.5rem; }
  @media (min-width: 1024px) { .homepage-main-grid { grid-template-columns: 380px 1fr; align-items: start; } }
  .events-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 2rem; }
  .event-card { background: white; border: 1px solid #f3f4f6; border-radius: 1.5rem; padding: 1.5rem; display: flex; flex-direction: column; justify-content: space-between; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
  .event-card:hover { transform: translateY(-4px); box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); border-color: #e5e7eb; }
  .past-card { background: transparent; border: 1px solid #e5e7eb; box-shadow: none; }
  .past-card:hover { transform: none; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
  .card-image-wrapper { position: relative; height: 13rem; border-radius: 1rem; overflow: hidden; margin-bottom: 1.25rem; background: #f3f4f6; }
  .card-img { width: 100%; height: 100%; object-fit: cover; }
  .placeholder-img { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: #9ca3af; font-weight: bold; font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.1em; }
  .category-badge { position: absolute; top: 1rem; left: 1rem; background: rgba(255, 255, 255, 0.95); color: #2563eb; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; padding: 0.35rem 0.85rem; border-radius: 9999px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); backdrop-filter: blur(4px); }
  .registered-badge { color: #059669; font-size: 0.875rem; font-weight: 800; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.35rem; }
  .card-title { font-size: 1.35rem; font-weight: 800; color: #1f2937; margin: 0; line-height: 1.3; }
  .meta-row { display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; font-weight: 600; color: #6b7280; margin-bottom: 0.5rem; }
  .btn-group { display: flex; gap: 0.75rem; margin-top: 1.5rem; }
  .btn { flex: 1; padding: 0.85rem; border-radius: 0.75rem; font-weight: 700; font-size: 0.875rem; cursor: pointer; border: none; transition: all 0.2s; text-align: center; width: 100%; }
  .btn-details { background: #f3f4f6; color: #374151; }
  .btn-details:hover { background: #e5e7eb; color: #111827; }
  .btn-register { background: #2563eb; color: white; box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2); }
  .btn-register:hover { background: #1d4ed8; box-shadow: 0 6px 8px -1px rgba(37, 99, 235, 0.3); transform: translateY(-1px); }
  .btn-joined { background: #ecfdf5; color: #059669; border: 1px solid #a7f3d0; cursor: default; }
  .empty-state { grid-column: 1 / -1; text-align: center; padding: 5rem 2rem; background: white; border-radius: 1.5rem; border: 2px dashed #e5e7eb; color: #6b7280; font-weight: 500; font-size: 1.125rem; }
`;

export default Events;