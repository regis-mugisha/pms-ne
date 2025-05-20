import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

export default function ParkingRegisterPage() {
  const [parking, setParking] = useState({
    code: "",
    name: "",
    availableSpaces: "",
    location: "",
    feePerHour: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/");
    const { role } = jwtDecode(token);
    if (role !== "ADMIN") {
      alert("Access denied");
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleRegister = async () => {
    try {
      if (!parking.code || !parking.name || !parking.location) {
        throw new Error("Code, name, and location are required");
      }
      const spaces = Number(parking.availableSpaces);
      const fee = Number(parking.feePerHour);
      if (spaces < 0 || fee < 0) {
        throw new Error("Spaces and fee must be non-negative");
      }
      await API.post("/parking", {
        ...parking,
        availableSpaces: spaces,
        feePerHour: fee,
      });
      alert("Parking registered successfully!");
      setParking({
        code: "",
        name: "",
        availableSpaces: "",
        location: "",
        feePerHour: "",
      });
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Register New Parking
        </h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <input
          className="w-full p-2 mb-4 border rounded"
          placeholder="Code"
          value={parking.code}
          onChange={(e) => setParking({ ...parking, code: e.target.value })}
          required
        />
        <input
          className="w-full p-2 mb-4 border rounded"
          placeholder="Name"
          value={parking.name}
          onChange={(e) => setParking({ ...parking, name: e.target.value })}
          required
        />
        <input
          type="number"
          className="w-full p-2 mb-4 border rounded"
          placeholder="Available Spaces"
          value={parking.availableSpaces}
          onChange={(e) =>
            setParking({ ...parking, availableSpaces: e.target.value })
          }
          required
        />
        <input
          className="w-full p-2 mb-4 border rounded"
          placeholder="Location"
          value={parking.location}
          onChange={(e) => setParking({ ...parking, location: e.target.value })}
          required
        />
        <input
          type="number"
          className="w-full p-2 mb-4 border rounded"
          placeholder="Fee per Hour"
          value={parking.feePerHour}
          onChange={(e) =>
            setParking({ ...parking, feePerHour: e.target.value })
          }
          required
        />
        <button
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          onClick={handleRegister}
        >
          Create Parking
        </button>
      </div>
    </div>
  );
}
