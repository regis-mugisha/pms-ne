import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API = axios.create({
  baseURL: "http://localhost:3000/api",
});

export const setAuthToken = (token) => {
  API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  const decoded = jwtDecode(token);
  localStorage.setItem("role", decoded.role); // store role
};

export default API;
