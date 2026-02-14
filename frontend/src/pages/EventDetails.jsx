import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await API.get(`/events/${id}`);
        setEvent(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching event details", error);
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const registerHandler = async () => {
    try {
      const { data } = await API.post(`/events/${id}/register`);
      alert(data.message); // Successfully registered!
    } catch (error) {
      const errorMsg = error.response?.data?.message;

      // PHASE D: Logic to detect incomplete academic profiles
      if (errorMsg && errorMsg.includes("complete your profile")) {
        if (
          window.confirm(
            `${errorMsg} Would you like to go to your profile page now to update it?`
          )
        ) {
          navigate("/profile");
        }
      } else {
        alert(errorMsg || "Registration failed. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 animate-pulse">Loading event details...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center mt-20">
        <p className="text-red-500 font-bold">Event not found.</p>
        <button 
          onClick={() => navigate("/")} 
          className="mt-4 text-blue-600 underline"
        >
          Back to Events
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10 bg-white shadow-xl rounded-2xl border border-gray-100">
      <div className="mb-8 border-b pb-6">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{event.title}</h1>
        <div className="flex items-center gap-3">
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            {event.category}
          </span>
          <p className="text-gray-500 text-sm italic">
            Organized by: <span className="font-semibold">{event.organizer?.name || "Unknown"}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h3 className="text-lg font-bold text-gray-800 mb-2">About this Event</h3>
          <p className="text-gray-600 leading-relaxed whitespace-pre-line">
            {event.description}
          </p>
        </div>

        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 h-fit">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Event Logistics</h3>
          <div className="space-y-4 text-sm">
            <div className="flex items-center gap-3">
              <span className="text-lg">📅</span>
              <div>
                <p className="font-bold">Date</p>
                <p className="text-gray-600">{new Date(event.date).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-lg">🕒</span>
              <div>
                <p className="font-bold">Time</p>
                <p className="text-gray-600">{event.time}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-lg">📍</span>
              <div>
                <p className="font-bold">Venue</p>
                <p className="text-gray-600">{event.venue}</p>
              </div>
            </div>
          </div>

          <button
            onClick={registerHandler}
            className="w-full mt-8 bg-green-600 text-white font-bold py-3 rounded-lg shadow-lg hover:bg-green-700 hover:-translate-y-1 transition-all duration-200 active:scale-95"
          >
            Register for Event
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;