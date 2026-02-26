import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login({ email, password });
      navigate("/");
    } catch (error) {
      alert("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const googleAuth = () => {
    // This directs the user to your backend Google OAuth route
    window.location.href = "https://campusconnect-api.onrender.com/api/auth/google"; 
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        
        {/* TOP GRADIENT HEADER */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-10 text-white text-center">
          <h2 className="text-4xl font-black tracking-tight mb-2">Welcome Back</h2>
          <p className="text-gray-400 font-medium text-sm">Sign in to manage your events and registrations</p>
        </div>

        {/* FORM SECTION */}
        <div className="p-8 space-y-6">
          
          {/* 🚀 GOOGLE OAUTH BUTTON */}
          <button 
            onClick={googleAuth}
            type="button"
            className="w-full flex items-center justify-center gap-3 py-3.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          <div className="relative flex items-center justify-center">
            <span className="absolute bg-white px-3 text-xs font-bold text-gray-400 uppercase tracking-widest">Or login with email</span>
            <div className="w-full h-[1px] bg-gray-100"></div>
          </div>

          <form onSubmit={submitHandler} className="space-y-5">
            {/* EMAIL INPUT */}
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
              <input
                type="email"
                className="w-full p-4 bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl outline-none transition"
                placeholder="name@mail.com"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* PASSWORD INPUT WITH FORGOT PASSWORD LINK */}
            <div className="space-y-1 relative">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-bold text-gray-700">Password</label>
                <Link 
                  to="/forgot-password" 
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <input
                type="password"
                className="w-full p-4 bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl outline-none transition"
                placeholder="••••••••"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* SUBMIT BUTTON */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 active:scale-95 text-lg mt-4 flex justify-center items-center"
            >
              {loading ? <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div> : "Sign In"}
            </button>
          </form>

          {/* REGISTER REDIRECT */}
          <p className="text-center text-gray-500 font-medium pt-2">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-600 font-bold hover:underline">
              Create one now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;