import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";

export default function AttendantDashboard() {
  const [activeCars, setActiveCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/");

    try {
      const { role } = jwtDecode(token);
      if (role !== "ATTENDANT") {
        alert("Access denied");
        return navigate("/");
      }
    } catch {
      alert("Invalid token");
      return navigate("/");
    }

    fetchActiveCars();
  }, [navigate, page]);

  const fetchActiveCars = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/car/active?page=${page}`);
      setActiveCars(res.data.cars);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      alert("Failed to load active cars");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Attendant Dashboard
          </h2>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/");
            }}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Quick Actions
            </h3>
            <div className="flex flex-col gap-3">
              <Link
                to="/car-entry"
                className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 text-center transition-colors"
              >
                Register Car Entry
              </Link>
              <Link
                to="/car-exit"
                className="bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 text-center transition-colors"
              >
                Register Car Exit
              </Link>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Currently Parked Cars
            </h3>
            {loading ? (
              <p className="text-gray-600">Loading...</p>
            ) : activeCars.length === 0 ? (
              <p className="text-gray-600">No cars currently parked</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2 text-left">Ticket Code</th>
                      <th className="border p-2 text-left">Plate Number</th>
                      <th className="border p-2 text-left">Entry Time</th>
                      <th className="border p-2 text-left">Parking Lot</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeCars.map((car) => (
                      <tr key={car.id} className="hover:bg-gray-50">
                        <td className="border p-2">{car.ticketCode}</td>
                        <td className="border p-2">{car.plateNumber}</td>
                        <td className="border p-2">
                          {new Date(car.entryTime).toLocaleString()}
                        </td>
                        <td className="border p-2">{car.parking.name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="flex justify-between items-center mt-4">
              <button
                className="bg-gray-300 p-2 rounded-lg disabled:opacity-50 transition-colors"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </button>
              <span className="text-gray-600">
                Page {page} of {totalPages}
              </span>
              <button
                className="bg-gray-300 p-2 rounded-lg disabled:opacity-50 transition-colors"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
