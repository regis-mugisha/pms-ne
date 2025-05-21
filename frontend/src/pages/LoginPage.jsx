import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import API, { setAuthToken } from "../api/api";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        // Check if token is expired
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp > currentTime) {
          // Token is valid, set it in axios headers
          setAuthToken(token);

          // Redirect based on role
          if (decoded.role === "ADMIN") {
            navigate("/admin");
          } else if (decoded.role === "ATTENDANT") {
            navigate("/attendant");
          }
        } else {
          // Token is expired, remove it
          localStorage.removeItem("token");
          setAuthToken(null);
        }
      } catch (err) {
        // Invalid token, remove it
        localStorage.removeItem("token");
        setAuthToken(null);
      }
    }
  }, [navigate]);

  const login = async () => {
    try {
      setLoading(true);
      const res = await API.post("/auth/login", form);
      const token = res.data.token;
      localStorage.setItem("token", token);
      setAuthToken(token); // Set the token in axios headers

      // Decode token to get user role
      const { role } = jwtDecode(token);

      // Redirect based on role
      if (role === "ADMIN") {
        navigate("/admin");
      } else if (role === "ATTENDANT") {
        navigate("/attendant");
      } else {
        setError("Invalid user role");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <button
            onClick={login}
            disabled={loading}
            className={`w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
        <p className="mt-4 text-center text-gray-600">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-500 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
