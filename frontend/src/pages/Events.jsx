import { useEffect, useState } from "react";
import API from "../api/axios";
import { Link } from "react-router-dom";

const Events = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const { data } = await API.get("/events");
      setEvents(data);
    };

    fetchEvents();
  }, []);

  return (
    <div>
      <h1>Upcoming Events</h1>

      {events.length === 0 && <p>No events available.</p>}

      {events.map((event) => (
        <div key={event._id} style={{ border: "1px solid gray", margin: "10px", padding: "10px" }}>
          <h3>{event.title}</h3>
          <p>{event.description}</p>
          <p>Date: {new Date(event.date).toLocaleDateString()}</p>

          <Link to={`/events/${event._id}`}>
            <button>View Details</button>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Events;