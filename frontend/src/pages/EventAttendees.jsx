import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";

const EventAttendees = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendees = async () => {
      try {
        const { data } = await API.get(`/events/${id}/attendees`);
        setAttendees(data);
      } catch (error) {
        console.error("Error fetching attendees", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendees();
  }, [id]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <button 
          onClick={() => navigate(-1)} 
          className="text-gray-400 font-bold hover:text-blue-600 transition"
        >
          ← Back to Dashboard
        </button>
        <h1 className="text-3xl font-black text-gray-800">Event Attendee List</h1>
        <div className="bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
          {attendees.length} Joined
        </div>
      </div>

      {loading ? (
        <p className="text-center py-20 animate-pulse text-gray-400">Loading attendance data...</p>
      ) : attendees.length === 0 ? (
        <div className="bg-gray-50 rounded-3xl p-20 text-center border-2 border-dashed border-gray-200">
          <p className="text-gray-500 font-bold">No students have registered for this event yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-widest">Student Name</th>
                <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-widest">Roll Number</th>
                <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-widest">Batch & Branch</th>
                <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Registered On</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {attendees.map((r) => (
                <tr key={r._id} className="hover:bg-blue-50/30 transition">
                  <td className="p-4 font-bold text-gray-800">{r.studentDetails?.name}</td>
                  <td className="p-4 font-mono text-sm text-blue-600 font-bold">{r.studentDetails?.rollNumber}</td>
                  <td className="p-4">
                    <p className="text-xs font-bold text-gray-700">{r.studentDetails?.branch}</p>
                    <p className="text-[10px] text-gray-400 uppercase font-black">{r.studentDetails?.batch}</p>
                  </td>
                  <td className="p-4 text-right text-xs font-medium text-gray-400">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EventAttendees;