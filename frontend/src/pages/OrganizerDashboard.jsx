import { useEffect, useState } from "react";
import API from "../api/axios";

const OrganizerDashboard = () => {
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Workshop",
    date: "",
    time: "",
    venue: ""
  });

  // Fetch my events
  const fetchMyEvents = async () => {
    const { data } = await API.get("/events/my/events");
    setEvents(data);
  };

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    await API.post("/events", formData);
    alert("Event created!");
    setFormData({
      title: "",
      description: "",
      category: "Workshop",
      date: "",
      time: "",
      venue: ""
    });
    fetchMyEvents();
  };

  return (
    <div>
      <h2>Organizer Dashboard</h2>

      <h3>Create Event</h3>
      <form onSubmit={submitHandler}>
        <input
          placeholder="Title"
          value={formData.title}
          onChange={(e) =>
            setFormData({ ...formData, title: e.target.value })
          }
        />

        <input
          placeholder="Description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />

        <input
          type="date"
          value={formData.date}
          onChange={(e) =>
            setFormData({ ...formData, date: e.target.value })
          }
        />

        <input
          placeholder="Time"
          value={formData.time}
          onChange={(e) =>
            setFormData({ ...formData, time: e.target.value })
          }
        />

        <input
          placeholder="Venue"
          value={formData.venue}
          onChange={(e) =>
            setFormData({ ...formData, venue: e.target.value })
          }
        />

        <button type="submit">Create Event</button>
      </form>

      <h3>My Events</h3>

      {events.map((event) => (
        <div key={event._id} style={{ border: "1px solid gray", margin: "10px", padding: "10px" }}>
          <h4>{event.title}</h4>
          <p>Status: {event.isApproved ? "Approved ✅" : "Pending ⏳"}</p>
        </div>
      ))}
    </div>
  );
};

export default OrganizerDashboard;
