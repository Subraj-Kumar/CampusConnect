import { useState } from "react";
import Calendar from "react-calendar";
import { useNavigate } from "react-router-dom";

const EventCalendar = ({ events = [] }) => {
  const navigate = useNavigate();
  const [value, setValue] = useState(new Date());
  const [hoveredDateEvents, setHoveredDateEvents] = useState([]);

  // This injects the blue dots into days that have events
  const tileContent = ({ date, view }) => {
    if (view === "month") {
      // Safely compare dates ignoring timezones
      const dayEvents = events.filter((e) => {
        const evDate = new Date(e.date);
        return evDate.getDate() === date.getDate() &&
               evDate.getMonth() === date.getMonth() &&
               evDate.getFullYear() === date.getFullYear();
      });

      if (dayEvents.length > 0) {
        return (
          <div
            className="calendar-dot-wrapper"
            onMouseEnter={() => setHoveredDateEvents(dayEvents)}
            onMouseLeave={() => setHoveredDateEvents([])}
            onClick={() => navigate(`/events/${dayEvents[0]._id}`)}
          >
            <div className="calendar-dot"></div>
          </div>
        );
      }
    }
    return null;
  };

  return (
    <div className="calendar-container">
      {/* 🎨 Standard CSS replacing Tailwind */}
      <style>{`
        .calendar-container {
          background: white;
          padding: 1.5rem;
          border-radius: 1.5rem;
          border: 1px solid #f3f4f6;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
          position: relative;
        }
        .calendar-title {
          font-size: 1.25rem;
          font-weight: 800;
          margin-bottom: 1.5rem;
          color: #1f2937;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .react-calendar {
          width: 100%;
          border: none;
          font-family: inherit;
        }
        .react-calendar__tile {
          padding: 0.75rem 0.5rem;
          position: relative;
        }
        .react-calendar__tile--active {
          background: #3b82f6 !important;
          color: white;
          border-radius: 0.5rem;
        }
        .react-calendar__tile:hover {
          background: #f3f4f6;
          border-radius: 0.5rem;
        }
        
        /* The Blue Dot Marker */
        .calendar-dot-wrapper {
          display: flex;
          justify-content: center;
          margin-top: 6px;
          height: 8px;
          cursor: pointer;
        }
        .calendar-dot {
          width: 6px;
          height: 6px;
          background-color: #2563eb;
          border-radius: 50%;
        }

        /* The Hover Tooltip */
        .calendar-tooltip {
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          margin-top: 1rem;
          background-color: #111827;
          color: white;
          padding: 1rem;
          border-radius: 1rem;
          width: 250px;
          z-index: 50;
          box-shadow: 0 10px 15px -3px rgba(0,0,0,0.3);
        }
        .tooltip-header {
          font-size: 0.65rem;
          font-weight: 800;
          text-transform: uppercase;
          color: #60a5fa;
          letter-spacing: 0.1em;
          margin-bottom: 0.5rem;
        }
        .tooltip-item {
          border-left: 2px solid #3b82f6;
          padding-left: 0.5rem;
          margin-bottom: 0.5rem;
        }
        .tooltip-item:last-child { margin-bottom: 0; }
        .tooltip-title { font-weight: 700; font-size: 0.875rem; margin: 0; }
        .tooltip-org { font-size: 0.65rem; color: #9ca3af; text-transform: uppercase; margin: 0; }
      `}</style>

      <h3 className="calendar-title">
        <span style={{ color: '#2563eb' }}>📅</span> Campus Schedule
      </h3>

      <Calendar
        onChange={setValue}
        value={value}
        tileContent={tileContent}
      />

      {/* 🧠 Tooltip Logic */}
      {hoveredDateEvents.length > 0 && (
        <div className="calendar-tooltip">
          <div className="tooltip-header">On this day:</div>
          {hoveredDateEvents.map((e) => (
            <div key={e._id} className="tooltip-item">
              <p className="tooltip-title">{e.title}</p>
              <p className="tooltip-org">{e.organizationName || "Campus Event"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventCalendar;