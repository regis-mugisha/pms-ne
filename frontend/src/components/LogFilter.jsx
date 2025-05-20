export default function LogFilter({ onFilterChange }) {
  const [action, setAction] = useState("");
  const [date, setDate] = useState("");

  const handleFilter = () => {
    onFilterChange({ action, date });
  };

  return (
    <div className="mb-4 flex space-x-4">
      <select
        value={action}
        onChange={(e) => setAction(e.target.value)}
        className="border p-2 rounded"
      >
        <option value="">All Actions</option>
        <option value="USER_REGISTER">User Register</option>
        <option value="LOGIN_SUCCESS">Login Success</option>
        <option value="CAR_ENTRY">Car Entry</option>
        <option value="CAR_EXIT">Car Exit</option>
      </select>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="border p-2 rounded"
      />
      <button
        onClick={handleFilter}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Filter
      </button>
    </div>
  );
}
