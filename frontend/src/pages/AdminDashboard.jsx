import { useEffect, useState } from "react";
import API from "../api/axios";

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);

  const fetchPendingEvents = async () => {
    const { data } = await API.get("/admin/events/pending");
    setEvents(data);
  };

  useEffect(() => {
    fetchPendingEvents();
  }, []);

  const approveEvent = async (id) => {
    await API.put(`/admin/events/${id}/approve`);
    fetchPendingEvents();
  };

  const rejectEvent = async (id) => {
    await API.delete(`/admin/events/${id}/reject`);
    fetchPendingEvents();
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <h3>Pending Events</h3>

      {events.length === 0 && <p>No pending events 🎉</p>}

      {events.map((event) => (
        <div key={event._id} style={{ border: "1px solid gray", margin: "10px", padding: "10px" }}>
          <h4>{event.title}</h4>
          <p>{event.description}</p>
          <p>Organizer: {event.organizer?.name}</p>

          <button onClick={() => approveEvent(event._id)}>
            Approve ✅
          </button>

          <button onClick={() => rejectEvent(event._id)} style={{ marginLeft: "10px" }}>
            Reject ❌
          </button>
        </div>
      ))}
    </div>
  );
};

export default AdminDashboard;
