import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      const { data } = await API.get(`/events/${id}`);
      setEvent(data);
    };

    fetchEvent();
  }, [id]);

  if (!event) return <p>Loading...</p>;

  return (
    <div>
      <h2>{event.title}</h2>
      <p>{event.description}</p>
      <p>Category: {event.category}</p>
      <p>Date: {new Date(event.date).toLocaleDateString()}</p>
      <p>Time: {event.time}</p>
      <p>Venue: {event.venue}</p>
      <p>Organizer: {event.organizer?.name}</p>
    </div>
  );
};

export default EventDetails;
