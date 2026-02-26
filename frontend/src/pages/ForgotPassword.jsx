import { useState } from "react";
import API from "../api/axios";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/auth/forgotpassword", { email });
      setMessage("Check your email for the reset link!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-gray-100">
        <h2 className="text-3xl font-black text-gray-900 mb-2">Forgot Password?</h2>
        <p className="text-gray-500 mb-8 font-medium">Enter your email to receive a recovery link.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            placeholder="name@jnu.ac.in"
            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-blue-500 transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button 
            disabled={loading}
            className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition shadow-lg shadow-blue-100"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
        {message && <p className="mt-6 text-center font-bold text-blue-600 bg-blue-50 py-3 rounded-xl">{message}</p>}
        <div className="mt-6 text-center">
          <Link to="/login" className="text-sm font-bold text-gray-400 hover:text-gray-600">Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;