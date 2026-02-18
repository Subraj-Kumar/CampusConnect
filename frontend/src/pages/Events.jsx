import { useEffect, useState, useContext, useCallback } from "react";
import API from "../api/axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import UpcomingSlider from "../components/UpcomingSlider"; 

const Events = () => {
  const { user } = useContext(AuthContext);

  // Data States
  const [sliderEvents, setSliderEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  
  // Filter States
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("asc");
  
  // Logic States
  const [loadingId, setLoadingId] = useState(null);
  const [registeredMap, setRegisteredMap] = useState({});

  /**
   * 📡 ROBUST DATA FETCHING (Memoized)
   * We use 'useCallback' to fix the React warning and prevent infinite loops.
   * We separate try/catch blocks so one failure doesn't break the whole page.
   */
  const fetchData = useCallback(async () => {
    let sliderData = [];

    // 1. Try to fetch Slider Events (Fail gracefully)
    try {
      const res = await API.get("/events/upcoming/slider");
      sliderData = res.data || [];
      setSliderEvents(sliderData);
    } catch (error) {
      console.warn("Slider endpoint issue:", error.message);
      // We continue executing even if this fails
    }

    // 2. Fetch Main Event List
    try {
      const { data: mainData } = await API.get(
        `/events?search=${search}&category=${category}&sort=${sort}`
      );

      // Filter: Don't show events in the list if they are already in the slider
      const sliderIds = new Set(sliderData.map(e => String(e._id)));
      const filteredMain = mainData.filter(e => !sliderIds.has(String(e._id)));
      
      setUpcomingEvents(filteredMain);

      // 3. Check Registration Status (if student)
      if (user?.role === "student") {
        // We check status for ALL loaded events (slider + list)
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
  }, [search, category, sort, user]); // Only recreate this function if these change

  // Trigger fetch when filters change
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

  return (
    <div className="events-page-container">
      {/* 🎨 Built-in Styles for Instant Professional Look */}
      <style>{`
        .events-page-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 2rem;
          font-family: 'Inter', sans-serif;
          background-color: #f9fafb;
          min-height: 100vh;
        }
        /* Controls Section */
        .controls-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .page-title {
          font-size: 2.25rem;
          font-weight: 800;
          color: #111827;
          margin: 0;
        }
        .filters-wrapper {
          display: flex;
          gap: 1rem;
          background: white;
          padding: 0.75rem;
          border-radius: 1rem;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
          border: 1px solid #e5e7eb;
          flex-wrap: wrap;
        }
        .search-input {
          padding: 0.75rem 1rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.75rem;
          min-width: 250px;
          outline: none;
          transition: all 0.2s;
        }
        .search-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        .filter-select {
          padding: 0.75rem 2rem 0.75rem 1rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.75rem;
          background-color: #f9fafb;
          cursor: pointer;
        }

        /* Grid Layout */
        .events-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 2rem;
        }

        /* Card Styles */
        .event-card {
          background: white;
          border: 1px solid #f3f4f6;
          border-radius: 1.5rem;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }
        .event-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }
        
        /* Card Image */
        .card-image-wrapper {
          position: relative;
          height: 12rem;
          border-radius: 1rem;
          overflow: hidden;
          margin-bottom: 1rem;
          background: #f3f4f6;
        }
        .card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .category-badge {
          position: absolute;
          top: 1rem;
          left: 1rem;
          background: rgba(255, 255, 255, 0.95);
          color: #2563eb;
          font-size: 0.7rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        /* Card Content */
        .card-title {
          font-size: 1.25rem;
          font-weight: 800;
          color: #1f2937;
          margin: 0 0 0.5rem 0;
          line-height: 1.2;
        }
        .card-desc {
          color: #6b7280;
          font-size: 0.875rem;
          margin-bottom: 1.5rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .meta-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          font-weight: 700;
          color: #9ca3af;
          margin-bottom: 0.25rem;
        }
        
        /* Buttons */
        .btn-group {
          display: flex;
          gap: 0.75rem;
          margin-top: 1.5rem;
        }
        .btn {
          flex: 1;
          padding: 0.75rem;
          border-radius: 0.75rem;
          font-weight: 700;
          font-size: 0.875rem;
          cursor: pointer;
          border: none;
          transition: all 0.2s;
          text-align: center;
        }
        .btn-details {
          background: #f3f4f6;
          color: #374151;
        }
        .btn-details:hover { background: #e5e7eb; }
        
        .btn-register {
          background: #2563eb;
          color: white;
          box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);
        }
        .btn-register:hover { background: #1d4ed8; }
        
        .btn-joined {
          background: #ecfdf5;
          color: #059669;
          border: 1px solid #d1fae5;
          cursor: default;
        }

        /* Empty State */
        .empty-state {
          grid-column: 1 / -1;
          text-align: center;
          padding: 4rem;
          background: white;
          border-radius: 1.5rem;
          border: 2px dashed #e5e7eb;
          color: #9ca3af;
          font-weight: 600;
        }
      `}</style>

      {/* 🎞 HERO SLIDER */}
      {sliderEvents.length > 0 && (
        <div style={{ marginBottom: '3rem' }}>
          <UpcomingSlider events={sliderEvents} />
        </div>
      )}

      {/* 🛠 CONTROLS HEADER */}
      <div className="controls-header">
        <div>
          <h1 className="page-title">Explore Events</h1>
          <p style={{ color: '#9ca3af', fontSize: '0.875rem', fontWeight: 600, marginTop: '0.25rem' }}>
            Discover upcoming activities on campus
          </p>
        </div>

        <div className="filters-wrapper">
          <input
            type="text"
            placeholder="Search by title..."
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="filter-select"
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
            className="filter-select"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="asc">📅 Soonest First</option>
            <option value="desc">📅 Furthest First</option>
          </select>
        </div>
      </div>

      {/* 📋 EVENT GRID */}
      <div className="events-grid">
        {upcomingEvents.length === 0 ? (
          <div className="empty-state">
            <p>No upcoming events match your criteria.</p>
          </div>
        ) : (
          upcomingEvents.map((event) => (
            <div key={event._id} className="event-card">
              <div>
                {/* Poster / Fallback */}
                <div className="card-image-wrapper">
                  {event.poster ? (
                    <img src={event.poster} alt={event.title} className="card-img" />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.1em' }}>
                      No Preview
                    </div>
                  )}
                  <span className="category-badge">{event.category}</span>
                </div>

                {/* Status Indicator */}
                {user?.role === "student" && registeredMap[event._id] && (
                  <div style={{ color: '#059669', fontSize: '0.75rem', fontWeight: '800', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    ✓ Registered
                  </div>
                )}

                <h3 className="card-title">{event.title}</h3>
                <p className="card-desc">{event.description}</p>

                <div className="meta-row">
                  <span>📅</span> {new Date(event.date).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
                <div className="meta-row">
                  <span>📍</span> {event.venue}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="btn-group">
                <Link to={`/events/${event._id}`} style={{ flex: 1, textDecoration: 'none' }}>
                  <button className="btn btn-details" style={{ width: '100%' }}>
                    Details
                  </button>
                </Link>

                {user?.role === "student" && (
                  <div style={{ flex: 1 }}>
                    {registeredMap[event._id] ? (
                      <button className="btn btn-joined" style={{ width: '100%' }} disabled>
                        Joined
                      </button>
                    ) : (
                      <button
                        onClick={() => registerHandler(event._id)}
                        disabled={loadingId === event._id}
                        className="btn btn-register"
                        style={{ width: '100%', opacity: loadingId === event._id ? 0.7 : 1 }}
                      >
                        {loadingId === event._id ? "..." : "Join"}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Events;