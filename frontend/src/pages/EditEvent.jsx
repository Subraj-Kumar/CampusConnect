import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [poster, setPoster] = useState(null);
  
  const [formData, setFormData] = useState({
    title: "", 
    description: "", 
    category: "Workshop", 
    date: "", 
    time: "", 
    venue: "", 
    externalFormUrl: "", 
    hasRefreshments: false
  });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await API.get(`/events/${id}`);
        // Format date to YYYY-MM-DD for the HTML date input to read it properly
        const formattedDate = new Date(data.date).toISOString().split('T')[0];
        
        // Populate the state with fetched data, mapping missing optional fields to empty strings/false
        setFormData({ 
          title: data.title || "", 
          description: data.description || "", 
          category: data.category || "Workshop", 
          date: formattedDate, 
          time: data.time || "", 
          venue: data.venue || "", 
          externalFormUrl: data.externalFormUrl || "", 
          hasRefreshments: data.hasRefreshments || false
        });
        setLoading(false);
      } catch (error) {
        console.error("Fetch failed", error);
        alert("Could not fetch event data.");
      }
    };
    fetchEvent();
  }, [id]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const data = new FormData();
    
    // Append all form data; ensure boolean is converted to string for FormData
    Object.keys(formData).forEach(key => {
      data.append(key, key === "hasRefreshments" ? String(formData[key]) : formData[key]);
    });
    
    // Only append poster if the user selected a NEW image
    if (poster) {
      data.append("poster", poster);
    }

    try {
      await API.put(`/events/${id}`, data, { headers: { "Content-Type": "multipart/form-data" } });
      alert("Event updated successfully!");
      navigate("/organizer");
    } catch (error) {
      console.error(error);
      alert("Update failed. Please ensure all fields (Title, Date, Time, Venue, Description) are filled.");
    }
  };

  const deleteHandler = async () => {
    if (window.confirm("Are you sure? This will permanently delete the event and its Cloudinary poster.")) {
      try {
        await API.delete(`/events/${id}`); 
        alert("Event and Poster deleted successfully.");
        navigate("/organizer");
      } catch (error) {
        console.error(error);
        alert("Delete failed.");
      }
    }
  };

  if (loading) return <div className="text-center py-20 animate-pulse text-gray-500 font-bold">Syncing data...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">Modify Event</h1>
        <button 
          type="button"
          onClick={deleteHandler} 
          className="bg-red-50 text-red-600 px-6 py-2.5 rounded-xl font-bold border border-red-100 hover:bg-red-600 hover:text-white transition-all shadow-sm flex items-center gap-2"
        >
          Delete <span className="hidden sm:inline">Event</span> 🗑️
        </button>
      </div>

      <form onSubmit={submitHandler} className="bg-white p-8 md:p-10 rounded-3xl shadow-xl space-y-6 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Event Title</label>
            <input 
              className="w-full p-4 bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl outline-none transition" 
              value={formData.title} 
              onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
              required 
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Category</label>
            <select 
              className="w-full p-4 bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl outline-none transition cursor-pointer" 
              value={formData.category} 
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="Workshop">Workshop</option>
              <option value="Talk">Talk</option>
              <option value="Hackathon">Hackathon</option>
              <option value="Seminar">Seminar</option>
              <option value="Sports">Sports</option>
              <option value="Technical">Technical</option>
              <option value="Recreational">Recreational</option>
              <option value="Cultural">Cultural</option>
              <option value="Event">Event</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Date</label>
            <input 
              type="date" 
              className="w-full p-4 bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl outline-none transition cursor-pointer" 
              value={formData.date} 
              onChange={(e) => setFormData({ ...formData, date: e.target.value })} 
              required 
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Time</label>
            <input 
              className="w-full p-4 bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl outline-none transition" 
              value={formData.time} 
              onChange={(e) => setFormData({ ...formData, time: e.target.value })} 
              placeholder="e.g. 10:00 AM"
              required 
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Update Event Poster (Leave blank to keep current)</label>
            <input
              type="file"
              accept="image/*"
              className="w-full p-4 bg-gray-50 border-dashed border-2 border-gray-300 rounded-xl outline-none transition cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              onChange={(e) => setPoster(e.target.files[0])}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Venue</label>
            <input 
              className="w-full p-4 bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl outline-none transition" 
              value={formData.venue} 
              onChange={(e) => setFormData({ ...formData, venue: e.target.value })} 
              required 
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Description</label>
            <textarea 
              className="w-full p-4 bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl outline-none transition h-32 resize-none" 
              value={formData.description} 
              onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
              required 
            />
          </div>

          {/* 🔗 GOOGLE FORM & REFRESHMENTS */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-bold text-blue-600 ml-1">External Registration (Google Form Link)</label>
            <input 
              className="w-full p-4 bg-blue-50 border border-blue-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 rounded-xl outline-none transition" 
              value={formData.externalFormUrl} 
              onChange={(e) => setFormData({ ...formData, externalFormUrl: e.target.value })} 
              placeholder="https://forms.gle/..."
            />
          </div>

          <div className="md:col-span-2 flex items-center gap-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
            <input 
              type="checkbox" 
              className="w-5 h-5 accent-blue-600 cursor-pointer" 
              checked={formData.hasRefreshments} 
              onChange={(e) => setFormData({ ...formData, hasRefreshments: e.target.checked })} 
              id="refToggle" 
            />
            <label htmlFor="refToggle" className="font-bold text-gray-700 cursor-pointer select-none">
              Refreshments Provided? 🍕
            </label>
          </div>
        </div>
        
        <div className="flex gap-4 pt-4">
          <button 
            type="submit" 
            className="flex-1 py-4 bg-gray-900 text-white font-black rounded-xl hover:bg-blue-600 transition-colors shadow-lg active:scale-95"
          >
            Save Changes
          </button>
          <button 
            type="button" 
            onClick={() => navigate("/organizer")} 
            className="px-8 py-4 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditEvent;