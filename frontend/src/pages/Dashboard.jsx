import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";

export default function Dashboard() {
  const [reports, setReports] = useState({ entries: [], exits: [] });
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

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
  }, [navigate]);

  const fetchReports = async () => {
    try {
      const res = await API.get(
        `/reports?start=${dateRange.start}&end=${dateRange.end}&page=${page}`
      );
      setReports(res.data);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      alert("Failed to load reports");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <div className="flex flex-col gap-4 mb-6">
        <Link to="/parking" className="text-blue-500 hover:underline">
          View Parking
        </Link>
        {role === "ADMIN" && (
          <>
            <Link
              to="/register-parking"
              className="text-blue-500 hover:underline"
            >
              Register Parking
            </Link>
            <Link to="/car-entry" className="text-blue-500 hover:underline">
              Register Car Entry
            </Link>
            <Link to="/car-exit" className="text-blue-500 hover:underline">
              Register Car Exit
            </Link>
          </>
        )}
      </div>
      <div className="bg-white p-6 rounded shadow-md">
        <h3 className="text-xl font-semibold mb-4">Reports</h3>
        <div className="flex gap-4 mb-4">
          <input
            type="date"
            className="p-2 border rounded"
            value={dateRange.start}
            onChange={(e) =>
              setDateRange({ ...dateRange, start: e.target.value })
            }
          />
          <input
            type="date"
            className="p-2 border rounded"
            value={dateRange.end}
            onChange={(e) =>
              setDateRange({ ...dateRange, end: e.target.value })
            }
          />
          <button
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            onClick={fetchReports}
          >
            Generate Report
          </button>
        </div>
        <div>
          <h4 className="font-semibold">Car Entries</h4>
          <table className="w-full border-collapse mb-4">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Ticket Code</th>
                <th className="border p-2">Plate Number</th>
                <th className="border p-2">Entry Time</th>
              </tr>
            </thead>
            <tbody>
              {reports.entries.map((entry) => (
                <tr key={entry.id}>
                  <td className="border p-2">{entry.ticketCode}</td>
                  <td className="border p-2">{entry.plateNumber}</td>
                  <td className="border p-2">
                    {new Date(entry.entryTime).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <h4 className="font-semibold">Car Exits</h4>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Ticket Code</th>
                <th className="border p-2">Plate Number</th>
                <th className="border p-2">Exit Time</th>
                <th className="border p-2">Charged</th>
              </tr>
            </thead>
            <tbody>
              {reports.exits.map((exit) => (
                <tr key={exit.id}>
                  <td className="border p-2">{exit.ticketCode}</td>
                  <td className="border p-2">{exit.plateNumber}</td>
                  <td className="border p-2">
                    {new Date(exit.exitTime).toLocaleString()}
                  </td>
                  <td className="border p-2">${exit.charged}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
      </div>
    </div>
  );
}
