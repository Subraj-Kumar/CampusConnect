import { createContext, useState, useEffect } from "react";
import API from "../api/axios";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize Auth State from LocalStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  // LOGIN
  const login = async (formData) => {
    const { data } = await API.post("/auth/login", formData);

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data));

    setUser(data);
  };

  // REGISTER
  const register = async (formData) => {
    const { data } = await API.post("/auth/register", formData);

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data));

    setUser(data);
  };

  // INSTANT PROFILE SYNC: The "Phase C" Fix
  // This function updates the UI state without requiring a logout/login
  const updateUser = (updatedData) => {
    // Keep existing token and metadata while merging new profile data
    const currentToken = localStorage.getItem("token");
    const newUserData = { ...user, ...updatedData, token: currentToken };

    localStorage.setItem("user", JSON.stringify(newUserData));
    setUser(newUserData); // Triggers immediate UI re-render
  };

  // LOGOUT
  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, updateUser, setUser, loading }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;