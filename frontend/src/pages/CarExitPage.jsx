import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

export default function CarExitPage() {
  const [plateNumber, setPlateNumber] = useState("");
  const [bill, setBill] = useState(null);
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

  const handleExit = async () => {
    try {
      if (!plateNumber) throw new Error("Plate number is required");
      const res = await API.post("/car/exit", { plateNumber }); // Changed to POST, match backend
      setBill(res.data.ticket);
      setPlateNumber("");
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Register Car Exit
        </h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <input
          className="w-full p-2 mb-4 border rounded"
          placeholder="Plate Number"
          value={plateNumber}
          onChange={(e) => setPlateNumber(e.target.value)}
          required
        />
        <button
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          onClick={handleExit}
        >
          Exit Car
        </button>
        {bill && (
          <div className="mt-4 p-4 border rounded bg-gray-50">
            <p>
              <strong>Ticket Code:</strong> {bill.ticketCode}
            </p>
            <p>
              <strong>Plate Number:</strong> {bill.plateNumber}
            </p>
            <p>
              <strong>Parked Hours:</strong> {bill.parkedHours}
            </p>
            <p>
              <strong>Charged Amount:</strong> ${bill.charged}
            </p>
            <p>
              <strong>Exited At:</strong>{" "}
              {new Date(bill.exitTime).toLocaleString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
