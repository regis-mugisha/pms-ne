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

    try {
      const { role } = jwtDecode(token);
      if (role !== "ADMIN") {
        alert("Access denied");
        // Navigate to the appropriate dashboard based on role
        if (role === "ATTENDANT") {
          navigate("/attendant");
        } else {
          navigate("/");
        }
      }
    } catch {
      alert("Invalid token");
      navigate("/");
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
      navigate("/parking");
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Register New Parking</h2>
          <button
            onClick={() => navigate("/admin")}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Back to Dashboard
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="code">
                Code
              </label>
              <input
                id="code"
                type="text"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={parking.code}
                onChange={(e) =>
                  setParking({ ...parking, code: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                type="text"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={parking.name}
                onChange={(e) =>
                  setParking({ ...parking, name: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="location">
                Location
              </label>
              <input
                id="location"
                type="text"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={parking.location}
                onChange={(e) =>
                  setParking({ ...parking, location: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="spaces">
                Available Spaces
              </label>
              <input
                id="spaces"
                type="number"
                min="0"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={parking.availableSpaces}
                onChange={(e) =>
                  setParking({ ...parking, availableSpaces: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="fee">
                Fee per Hour ($)
              </label>
              <input
                id="fee"
                type="number"
                min="0"
                step="0.01"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={parking.feePerHour}
                onChange={(e) =>
                  setParking({ ...parking, feePerHour: e.target.value })
                }
                required
              />
            </div>
            <button
              onClick={handleRegister}
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Register Parking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
