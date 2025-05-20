import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

export default function ParkingList() {
  const [parkings, setParkings] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
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

    const fetchParkings = async () => {
      try {
        const res = await API.get(`/parking/available?page=${page}`);
        setParkings(res.data.parkings);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        setError("Failed to load parking data");
      }
    };
    fetchParkings();
  }, [navigate, page]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-bold mb-4">Available Parking</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {parkings.map((p) => (
          <div key={p.code} className="bg-white p-4 rounded shadow-md">
            <h3 className="font-semibold">{p.name}</h3>
            <p>
              <strong>Location:</strong> {p.location}
            </p>
            <p>
              <strong>Spaces:</strong> {p.availableSpaces}
            </p>
            <p>
              <strong>Fee/hr:</strong> ${p.feePerHour}
            </p>
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-4">
        <button
          className="bg-gray-300 p-2 rounded disabled:opacity-50"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          className="bg-gray-300 p-2 rounded disabled:opacity-50"
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
