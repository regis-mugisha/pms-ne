import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";
import Pagination from "../components/Pagination";

export default function ParkingList() {
  const navigate = useNavigate();
  const [parkings, setParkings] = useState([]);
  const [role, setRole] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/");

    try {
      const { role } = jwtDecode(token);
      setRole(role);
      if (!["ADMIN", "ATTENDANT"].includes(role)) {
        alert("Access denied");
        return navigate("/");
      }
    } catch {
      alert("Invalid token");
      return navigate("/");
    }

    fetchParkings();
  }, [navigate, page]);

  const fetchParkings = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/parking?page=${page}`);
      setParkings(res.data.parkings);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      alert("Failed to load parkings");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToDashboard = () => {
    if (role === "ADMIN") {
      navigate("/admin");
    } else if (role === "ATTENDANT") {
      navigate("/attendant");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBackToDashboard}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Back to Dashboard
            </button>
            <h2 className="text-2xl font-bold">Parking List</h2>
          </div>
          {role === "ADMIN" && (
            <Link
              to="/register-parking"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add New Parking
            </Link>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">Code</th>
                  <th className="border p-2">Name</th>
                  <th className="border p-2">Location</th>
                  <th className="border p-2">Available Spaces</th>
                  <th className="border p-2">Fee per Hour</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center p-4">
                      Loading...
                    </td>
                  </tr>
                ) : parkings.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center p-4">
                      No parking records found
                    </td>
                  </tr>
                ) : (
                  parkings.map((parking) => (
                    <tr key={parking.id}>
                      <td className="border p-2">{parking.code}</td>
                      <td className="border p-2">{parking.name}</td>
                      <td className="border p-2">{parking.location}</td>
                      <td className="border p-2">{parking.availableSpaces}</td>
                      <td className="border p-2">${parking.feePerHour}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      </div>
    </div>
  );
}
