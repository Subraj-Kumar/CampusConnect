import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom"; // Added Link

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await login({ email, password });
      
      // Fetch the role from the updated local storage
      const user = JSON.parse(localStorage.getItem("user"));
      const role = user.role;

      // Traffic Controller Logic
      if (role === "admin") navigate("/admin");
      else if (role === "organizer") navigate("/organizer");
      else navigate("/");
      
    } catch (error) {
      alert(error.response?.data?.message || "Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <div className="w-full max-w-md p-8 bg-white shadow-2xl rounded-2xl border border-gray-100">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Login to CampusConnect</h2>
        
        <form onSubmit={submitHandler} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="e.g. subrata@college.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition duration-200 transform active:scale-95 shadow-lg"
          >
            Sign In
          </button>
        </form>

        {/* THE ESCAPE HATCH FOR NEW USERS */}
        <div className="mt-8 pt-6 border-t text-center">
          <p className="text-gray-600">
            First time on CampusConnect? 
            <Link 
              to="/register" 
              className="ml-2 text-blue-600 font-bold hover:underline"
            >
              Create an Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;