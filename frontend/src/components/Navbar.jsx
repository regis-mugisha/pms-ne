import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { role } = token ? jwtDecode(token) : { role: null };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-xl font-bold">
            Parking Management System
          </Link>
          {token && (
            <Link
              to={role === "ADMIN" ? "/admin" : "/attendant"}
              className="hover:text-gray-300"
            >
              Dashboard
            </Link>
          )}
        </div>
        <div>
          {token ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/"
              className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
