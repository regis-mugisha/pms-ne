import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import API from "../api/api";
import LogFilter from "../components/LogFilter";
import Pagination from "../components/Pagination";

export default function LogsPage() {
  const [logs, setLogs] = useState([]);
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
      if (!["ADMIN", "ATTENDANT"].includes(role)) {
        alert("Access denied");
        return navigate("/");
      }
    } catch {
      alert("Invalid token");
      return navigate("/");
    }
  }, [navigate]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await API.get(
        `/reports?start=${dateRange.start}T00:00:00Z&end=${dateRange.end}T23:59:59Z&page=${page}`
      );
      setLogs([...res.data.entries, ...res.data.exits]);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      alert("Failed to load logs");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Parking Logs</h2>
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Back
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <LogFilter
            dateRange={dateRange}
            setDateRange={setDateRange}
            onFilter={fetchLogs}
            loading={loading}
          />

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">Ticket Code</th>
                  <th className="border p-2">Plate Number</th>
                  <th className="border p-2">Entry Time</th>
                  <th className="border p-2">Exit Time</th>
                  <th className="border p-2">Charged</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td className="border p-2">{log.ticketCode}</td>
                    <td className="border p-2">{log.plateNumber}</td>
                    <td className="border p-2">
                      {new Date(log.entryTime).toLocaleString()}
                    </td>
                    <td className="border p-2">
                      {log.exitTime
                        ? new Date(log.exitTime).toLocaleString()
                        : "-"}
                    </td>
                    <td className="border p-2">
                      {log.charged ? `$${log.charged}` : "-"}
                    </td>
                  </tr>
                ))}
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
