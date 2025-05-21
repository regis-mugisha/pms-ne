import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import API from "../api/api";

export default function AdminDashboard() {
  const [reports, setReports] = useState({ entries: [], exits: [] });
  const [revenue, setRevenue] = useState({ revenue: [], totalRevenue: 0 });
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/");

    try {
      const { role } = jwtDecode(token);
      if (role !== "ADMIN") {
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
      setLoading(true);
      const [reportsRes, revenueRes] = await Promise.all([
        API.get(
          `/reports?start=${dateRange.start}T00:00:00Z&end=${dateRange.end}T23:59:59Z&page=${page}`
        ),
        API.get(
          `/reports/revenue?start=${dateRange.start}T00:00:00Z&end=${dateRange.end}T23:59:59Z&page=${page}`
        ),
      ]);
      setReports(reportsRes.data);
      setRevenue(revenueRes.data);
      setTotalPages(reportsRes.data.totalPages);
    } catch (err) {
      alert("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Admin Dashboard</h2>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/");
            }}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
            <div className="flex flex-col gap-3">
              <Link
                to="/register-parking"
                className="bg-blue-500 text-white p-3 rounded hover:bg-blue-600 text-center"
              >
                Register New Parking
              </Link>
              <Link
                to="/parking"
                className="bg-green-500 text-white p-3 rounded hover:bg-green-600 text-center"
              >
                View All Parkings
              </Link>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Revenue Summary</h3>
            <div className="text-3xl font-bold text-green-600 mb-2">
              ${revenue.totalRevenue.toFixed(2)}
            </div>
            <p className="text-gray-600">Total Revenue</p>
            <div className="mt-4">
              {revenue.revenue.map((item) => (
                <div
                  key={item.parkingCode}
                  className="flex justify-between py-2 border-b"
                >
                  <span>{item.parkingCode}</span>
                  <span>${item.totalRevenue.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Reports</h3>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <input
              type="date"
              className="p-2 border rounded flex-1"
              value={dateRange.start}
              onChange={(e) =>
                setDateRange({ ...dateRange, start: e.target.value })
              }
            />
            <input
              type="date"
              className="p-2 border rounded flex-1"
              value={dateRange.end}
              onChange={(e) =>
                setDateRange({ ...dateRange, end: e.target.value })
              }
            />
            <button
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
              onClick={fetchReports}
              disabled={loading}
            >
              {loading ? "Loading..." : "Generate Report"}
            </button>
          </div>

          <div className="overflow-x-auto">
            <h4 className="font-semibold mb-2">Car Entries</h4>
            <table className="w-full border-collapse mb-6">
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

            <h4 className="font-semibold mb-2">Car Exits</h4>
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
          </div>

          <div className="flex justify-between items-center mt-4">
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
