import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

export default function RegisterPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "DRIVER",
  });
  const navigate = useNavigate();

  const register = async () => {
    try {
      await API.post("/auth/register", form);
      alert("Registered! Please login.");
      navigate("/");
    } catch (err) {
      alert(`Registration failed: ${err.message}`);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <input
        placeholder="First Name"
        onChange={(e) => setForm({ ...form, firstName: e.target.value })}
      />
      <input
        placeholder="Last Name"
        onChange={(e) => setForm({ ...form, lastName: e.target.value })}
      />
      <input
        placeholder="Email"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <select onChange={(e) => setForm({ ...form, role: e.target.value })}>
        <option value="DRIVER">Driver</option>
        <option value="ADMIN">Admin</option>
      </select>
      <button onClick={register}>Register</button>
    </div>
  );
}
