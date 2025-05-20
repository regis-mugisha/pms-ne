import { useEffect, useState } from "react";
import API from "../api/api";
import LogFilter from "../components/LogFilter";
import Pagination from "../components/Pagination";

export default function LogsPage() {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage] = useState(5);
  const [filters, setFilters] = useState({ action: "", date: "" });

  useEffect(() => {
    fetchLogs();
  }, [page, filters]);

  const fetchLogs = async () => {
    try {
      const params = new URLSearchParams({
        page,
        perPage,
        ...(filters.action && { action: filters.action }),
        ...(filters.date && { date: filters.date }),
      });
      const res = await API.get(`/logs?${params.toString()}`);
      setLogs(res.data.logs || []);
      setTotalPages(Math.ceil((res.data.total || 1) / perPage));
    } catch (err) {
      console.error("Fetch logs error:", err);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Logs</h1>
      <LogFilter onFilterChange={(newFilters) => setFilters(newFilters)} />
      <table className="w-full border-collapse mb-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Action</th>
            <th className="border p-2">User ID</th>
            <th className="border p-2">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id} className="border">
              <td className="border p-2">{log.action}</td>
              <td className="border p-2">{log.userId || "-"}</td>
              <td className="border p-2">
                {new Date(log.createdAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
