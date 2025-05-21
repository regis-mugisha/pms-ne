import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";

export default function RegisterPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "ATTENDANT",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const register = async () => {
    try {
      setLoading(true);
      // Basic client-side validation
      if (!form.email.includes("@")) throw new Error("Invalid email");
      if (form.password.length < 6)
        throw new Error("Password must be at least 6 characters");

      await API.post("/auth/register", form);
      alert("Registered successfully! Please login.");
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h2>Register as Parking Attendant</h2>
      <p className="text-gray-600 mb-4">
        Create your account to manage parking operations
      </p>
      {error && <p className="error">{error}</p>}
      <input
        placeholder="First Name"
        value={form.firstName}
        onChange={(e) => setForm({ ...form, firstName: e.target.value })}
        required
      />
      <input
        placeholder="Last Name"
        value={form.lastName}
        onChange={(e) => setForm({ ...form, lastName: e.target.value })}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        required
      />
      <button
        onClick={register}
        disabled={loading}
        className={loading ? "opacity-50 cursor-not-allowed" : ""}
      >
        {loading ? "Registering..." : "Register"}
      </button>
      <p className="mt-2">
        Already have an account?{" "}
        <Link to="/" className="text-blue-500">
          Login
        </Link>
      </p>
    </div>
  );
}
