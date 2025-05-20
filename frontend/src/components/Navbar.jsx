import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";

export default function Navbar() {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      API.setAuthToken(token);
      const payload = JSON.parse(atob(token.split(".")[1]));
      setRole(payload.role);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    API.setAuthToken(null);
    setRole(null);
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav className="bg-gray-800 p-4 text-white flex justify-between items-center">
      <div className="space-x-4">
        {isLoggedIn && (
          <>
            <Link to="/dashboard" className="hover:text-gray-300">
              Dashboard
            </Link>
            {role === "ADMIN" && (
              <Link to="/parking" className="hover:text-gray-300">
                Parking Management
              </Link>
            )}
            <Link to="/car-entry" className="hover:text-gray-300">
              Car Entry
            </Link>
            <Link to="/car-exit" className="hover:text-gray-300">
              Car Exit
            </Link>
          </>
        )}
      </div>
      <div className="space-x-4">
        {role && <span>Role: {role}</span>}
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        ) : (
          <>
            <Link to="/login" className="hover:text-gray-300">
              Login
            </Link>
            <Link to="/register" className="hover:text-gray-300">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
