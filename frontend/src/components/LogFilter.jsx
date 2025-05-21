import React from "react";

export default function LogFilter({
  dateRange,
  setDateRange,
  onFilter,
  loading,
}) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-4">
      <input
        type="date"
        className="p-2 border rounded flex-1"
        value={dateRange.start}
        onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
      />
      <input
        type="date"
        className="p-2 border rounded flex-1"
        value={dateRange.end}
        onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
      />
      <button
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
        onClick={onFilter}
        disabled={loading}
      >
        {loading ? "Loading..." : "Filter Logs"}
      </button>
    </div>
  );
}
