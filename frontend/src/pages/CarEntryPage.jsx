import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import ParkingTicket from "../components/ParkingTicket";

export default function CarEntryPage() {
  const [form, setForm] = useState({
    plateNumber: "",
    parkingCode: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [availableParkings, setAvailableParkings] = useState([]);
  const [ticket, setTicket] = useState(null);
  const [selectedParking, setSelectedParking] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/");

    try {
      const { role } = jwtDecode(token);
      if (!["ADMIN", "ATTENDANT"].includes(role)) {
        alert("Access denied");
        if (role === "ADMIN") {
          navigate("/admin");
        } else if (role === "ATTENDANT") {
          navigate("/attendant");
        } else {
          navigate("/");
        }
      }
    } catch {
      alert("Invalid token");
      navigate("/");
    }

    fetchAvailableParkings();
  }, [navigate]);

  const fetchAvailableParkings = async () => {
    try {
      const res = await API.get("/parking/available");
      setAvailableParkings(res.data.parkings);
    } catch (err) {
      setError("Failed to load available parkings");
    }
  };

  const handleEntry = async () => {
    try {
      setLoading(true);
      const res = await API.post("/car/entry", form);
      const parking = availableParkings.find(
        (p) => p.code === form.parkingCode
      );
      setSelectedParking(parking);
      setTicket(res.data.ticket);
      setForm({ plateNumber: "", parkingCode: "" });
      await fetchAvailableParkings();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to register car entry");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseTicket = () => {
    setTicket(null);
    setSelectedParking(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="max-w-md mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Car Entry</h2>
          <button
            onClick={() => {
              const { role } = jwtDecode(localStorage.getItem("token"));
              navigate(role === "ADMIN" ? "/admin" : "/attendant");
            }}
            className="w-full sm:w-auto bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <div className="space-y-4">
            <div>
              <label
                className="block text-gray-700 mb-2 font-medium"
                htmlFor="plateNumber"
              >
                Plate Number
              </label>
              <input
                id="plateNumber"
                type="text"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                value={form.plateNumber}
                onChange={(e) =>
                  setForm({ ...form, plateNumber: e.target.value })
                }
                placeholder="Enter plate number"
                required
              />
            </div>
            <div>
              <label
                className="block text-gray-700 mb-2 font-medium"
                htmlFor="parkingCode"
              >
                Parking Lot
              </label>
              <select
                id="parkingCode"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                value={form.parkingCode}
                onChange={(e) =>
                  setForm({ ...form, parkingCode: e.target.value })
                }
                required
              >
                <option value="">Select a parking lot</option>
                {availableParkings.map((parking) => (
                  <option key={parking.code} value={parking.code}>
                    {parking.name} - {parking.availableSpaces} spaces available
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={handleEntry}
              disabled={loading}
              className={`w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-colors ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Processing..." : "Register Entry"}
            </button>
          </div>
        </div>
      </div>

      {ticket && selectedParking && (
        <ParkingTicket
          ticket={ticket}
          parking={selectedParking}
          onClose={handleCloseTicket}
        />
      )}
    </div>
  );
}
