import axios from "axios";

const API = axios.create({
  baseURL: "http://13.126.202.153:5000/api"
});

// Attach token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;