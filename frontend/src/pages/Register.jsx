import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    organization: ""
  });

  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      navigate("/");
    } catch (error) {
      alert("Registration failed");
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        
        {/* TOP GRADIENT HEADER */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-10 text-white text-center">
          <h2 className="text-4xl font-black tracking-tight mb-2">Join CampusConnect</h2>
          <p className="opacity-90 font-medium text-lg">Create your account to start exploring JNU events</p>
        </div>

        {/* FORM SECTION */}
        <form onSubmit={submitHandler} className="p-10 space-y-6">
          
          <div className="space-y-4">
            {/* NAME INPUT */}
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700 ml-1">Full Name</label>
              <input
                className="w-full p-4 bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl outline-none transition"
                placeholder="Enter your name"
                required
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            {/* EMAIL INPUT */}
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
              <input
                type="email"
                className="w-full p-4 bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl outline-none transition"
                placeholder="name@mail.com"
                required
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            {/* PASSWORD INPUT */}
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700 ml-1">Password</label>
              <input
                type="password"
                className="w-full p-4 bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl outline-none transition"
                placeholder="••••••••"
                required
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            {/* ROLE SELECTION */}
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700 ml-1">I am a...</label>
              <select
                className="w-full p-4 bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl outline-none transition cursor-pointer font-semibold text-gray-700"
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="student">Student</option>
                <option value="organizer">Event Organizer</option>
              </select>
            </div>

            {/* CONDITIONAL ORGANIZATION INPUT */}
            {formData.role === "organizer" && (
              <div className="space-y-1 animate-in fade-in slide-in-from-top-2">
                <label className="text-sm font-bold text-blue-600 ml-1">Club / Department Name</label>
                <input
                  className="w-full p-4 bg-blue-50 border border-blue-200 focus:border-blue-500 rounded-2xl outline-none transition"
                  placeholder="e.g. Photography Society, CSE Dept"
                  required
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                />
              </div>
            )}
          </div>

          {/* SUBMIT BUTTON */}
          <button 
            type="submit" 
            className="w-full py-4 bg-gray-900 text-white font-black rounded-2xl hover:bg-blue-600 transition-colors shadow-xl active:scale-95 text-lg mt-8"
          >
            Create Free Account
          </button>

          {/* LOGIN REDIRECT */}
          <p className="text-center text-gray-500 font-medium pt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;