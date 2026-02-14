import { useState, useContext } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";

const Profile = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || "",
    batch: user.batch || "",
    rollNumber: user.rollNumber || "",
    branch: user.branch || ""
  });

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.put("/auth/profile", formData);
      updateUser(data); // INSTANT SYNC: Navbar and Profile update now!
      setIsEditing(false); // Switch back to view mode
      alert("Profile updated successfully!");
    } catch (error) {
      alert(error.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white shadow-xl rounded-2xl border border-gray-100">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <h2 className="text-3xl font-extrabold text-gray-900">Academic Profile</h2>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="text-blue-600 font-bold hover:bg-blue-50 px-4 py-2 rounded-lg transition"
          >
            ✏️ Edit Profile
          </button>
        )}
      </div>

      {!isEditing ? (
        /* VIEW MODE */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProfileField label="Full Name" value={user.name} />
          <ProfileField label="Email" value={user.email} />
          <ProfileField label="Batch" value={user.batch} />
          <ProfileField label="Roll Number" value={user.rollNumber} />
          <ProfileField label="Branch" value={user.branch} />
        </div>
      ) : (
        /* EDIT MODE */
        <form onSubmit={submitHandler} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <EditField label="Name" value={formData.name} onChange={(v) => setFormData({...formData, name: v})} />
            <EditField label="Batch" value={formData.batch} onChange={(v) => setFormData({...formData, batch: v})} />
            <EditField label="Roll No" value={formData.rollNumber} onChange={(v) => setFormData({...formData, rollNumber: v})} />
            <EditField label="Branch" value={formData.branch} onChange={(v) => setFormData({...formData, branch: v})} />
          </div>
          <div className="flex gap-4 pt-4">
            <button type="submit" className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 shadow-lg">Save Changes</button>
            <button type="button" onClick={() => setIsEditing(false)} className="text-gray-500 font-bold px-6">Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
};

// Small helper components for cleaner code
const ProfileField = ({ label, value }) => (
  <div className="p-4 bg-gray-50 rounded-lg">
    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</p>
    <p className="text-lg font-semibold text-gray-800">{value || "Not Set"}</p>
  </div>
);

const EditField = ({ label, value, onChange }) => (
  <div>
    <label className="block text-sm font-bold text-gray-700 mb-1">{label}</label>
    <input className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={value} onChange={(e) => onChange(e.target.value)} />
  </div>
);

export default Profile;