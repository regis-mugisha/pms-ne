import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

export default function CarEntryPage() {
  const [data, setData] = useState({
    plateNumber: "",
    parkingCode: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/");
    const { role } = jwtDecode(token);
    if (role !== "ATTENDANT") {
      alert("Access denied");
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleEntry = async () => {
    try {
      if (!data.plateNumber || !data.parkingCode) {
        throw new Error("All fields are required");
      }
      const res = await API.post("/car/entry", data);
      alert(`Car entered. Ticket Code: ${res.data.ticket.ticketCode}`);
      setData({ plateNumber: "", parkingCode: "" });
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Register Car Entry
        </h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <input
          className="w-full p-2 mb-4 border rounded"
          placeholder="Plate Number"
          value={data.plateNumber}
          onChange={(e) => setData({ ...data, plateNumber: e.target.value })}
          required
        />
        <input
          className="w-full p-2 mb-4 border rounded"
          placeholder="Parking Code"
          value={data.parkingCode}
          onChange={(e) => setData({ ...data, parkingCode: e.target.value })}
          required
        />
        <button
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          onClick={handleEntry}
        >
          Enter Car
        </button>
      </div>
    </div>
  );
}
