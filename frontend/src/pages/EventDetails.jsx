import { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";

const EventDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const { data } = await API.get(`/events/${id}`);
        setEvent(data);

        // If logged in as student, check if already joined
        if (user?.role === "student") {
          const res = await API.get(`/events/${id}/registration-status`);
          setIsRegistered(res.data.registered);
        }
      } catch (error) {
        console.error("Error fetching event details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEventData();
  }, [id, user]);

  const handleRegister = async () => {
    if (!user) return navigate("/login");
    try {
      setRegistering(true);
      await API.post(`/events/${id}/register`);
      setIsRegistered(true);
      alert("Successfully registered!");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    } finally {
      setRegistering(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  if (!event) return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-bold text-gray-400">Event not found.</h2>
      <Link to="/" className="text-blue-600 underline mt-4 inline-block">Back to Home</Link>
    </div>
  );

  return (
    <div className="max-w-[1200px] mx-auto p-6 md:p-10 min-h-screen">
      
      {/* 🚀 BACK NAVIGATION */}
      <Link to="/" className="inline-flex items-center text-sm font-bold text-gray-400 hover:text-blue-600 transition-colors mb-8 group">
        <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span> Back to Discovery
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        
        {/* 🖼️ LEFT SIDE: THE POSTER */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-3 rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden">
            {event.poster ? (
              <img 
                src={event.poster} 
                alt={event.title} 
                className="w-full h-auto rounded-[1.5rem] object-cover shadow-inner"
              />
            ) : (
              <div className="w-full h-96 bg-gray-100 rounded-[1.5rem] flex flex-col items-center justify-center text-gray-300">
                <span className="text-6xl mb-4">🖼️</span>
                <p className="font-bold uppercase tracking-widest text-xs">No Poster Provided</p>
              </div>
            )}
          </div>

          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-black text-gray-900 mb-6">About the Event</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line text-lg">
              {event.description}
            </p>
          </div>
        </div>

        {/* 📋 RIGHT SIDE: LOGISTICS & ACTIONS */}
        <aside className="space-y-6 sticky top-28">
          
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <div>
              <span className="inline-block bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-4">
                {event.category}
              </span>
              <h1 className="text-3xl font-black text-gray-900 leading-tight">
                {event.title}
              </h1>
            </div>

            <div className="space-y-4 pt-6 border-t border-gray-50">
              <div className="flex items-center gap-4">
                <div className="bg-gray-50 p-3 rounded-xl text-xl">📅</div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</p>
                  <p className="font-bold text-gray-800">{new Date(event.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-gray-50 p-3 rounded-xl text-xl">⏰</div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Time</p>
                  <p className="font-bold text-gray-800">{event.time}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-gray-50 p-3 rounded-xl text-xl">📍</div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Venue</p>
                  <p className="font-bold text-gray-800">{event.venue}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-gray-50 p-3 rounded-xl text-xl">👤</div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Organizer</p>
                  <p className="font-bold text-gray-800">{event.organizer?.name}</p>
                </div>
              </div>
            </div>

            {/* ACTION BUTTON */}
            {(!user || user.role === "student") && (
              <button 
                onClick={handleRegister}
                disabled={isRegistered || registering}
                className={`w-full py-4 rounded-2xl font-black text-lg transition-all duration-300 shadow-xl active:scale-95 mt-4 ${
                  isRegistered 
                    ? "bg-green-100 text-green-600 border border-green-200 cursor-default" 
                    : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200"
                }`}
              >
                {registering ? "Syncing..." : isRegistered ? "✓ Registered" : user ? "Join This Event" : "Login to Join"}
              </button>
            )}
            
            {isRegistered && (
              <p className="text-center text-xs font-bold text-green-500 mt-3 animate-pulse">
                You're on the list! See you there.
              </p>
            )}
          </div>

          {/* SOCIAL PROOF / ANALYTICS */}
          <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-3xl text-white shadow-xl">
             <div className="flex items-center gap-4">
                <div className="text-4xl font-black text-blue-400">
                  {event.registrationCount || 0}
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Current</p>
                  <p className="text-sm font-bold">Students Enrolled</p>
                </div>
             </div>
          </div>
        </aside>

      </div>
    </div>
  );
};

export default EventDetails;