import { Link } from "react-router-dom";

export default function Dashboard() {
  const role = localStorage.getItem("role");

  return (
    <div>
      <h2>Dashboard</h2>
      <Link to="/parking">View Parking</Link>
      <br />
      {role === "ADMIN" && (
        <>
          <Link to="/register-parking">Register Parking</Link>
          <br />
          <Link to="/car-entry">Register Car Entry</Link>
          <br />
          <Link to="/car-exit">Register Car Exit</Link>
          <br />
        </>
      )}
    </div>
  );
}
