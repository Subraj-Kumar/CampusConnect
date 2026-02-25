import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const OAuthSuccess = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get("token");
    const userData = params.get("user");

    if (token && userData) {
      // 🚀 THE FIX: Decode the URL string back into standard JSON!
      const decodedUser = decodeURIComponent(userData);

      localStorage.setItem("token", token);
      localStorage.setItem("user", decodedUser);
      
      // Hard reload so the AuthContext immediately recognizes the logged-in user
      window.location.href = "/";
    } else {
      navigate("/login");
    }
  }, [navigate, params]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-xl font-bold text-blue-600 animate-pulse">
        Authenticating securely with Google...
      </div>
    </div>
  );
};

export default OAuthSuccess;