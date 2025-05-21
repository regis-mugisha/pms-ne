import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import CarEntryPage from "./pages/CarEntryPage";
import CarExitPage from "./pages/CarExitPage";
import AdminDashboard from "./pages/AdminDashboard";
import AttendantDashboard from "./pages/AttendantDashboard";
import LoginPage from "./pages/LoginPage";
import ParkingList from "./pages/ParkingList";
import ParkingRegisterPage from "./pages/ParkingRegisterPage";
import RegisterPage from "./pages/RegisterPage";
import LogsPage from "./pages/LogsPage";
import { useEffect } from "react";
import { setAuthToken } from "./api/api";

// Protected Route component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/" />;

  try {
    const { role } = jwtDecode(token);
    if (!allowedRoles.includes(role)) {
      return <Navigate to="/" />;
    }
    return children;
  } catch {
    return <Navigate to="/" />;
  }
};

function App() {
  useEffect(() => {
    // Set auth token from localStorage on app load
    const token = localStorage.getItem("token");
    if (token) {
      setAuthToken(token);
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/register-parking"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <ParkingRegisterPage />
            </ProtectedRoute>
          }
        />

        {/* Attendant Routes */}
        <Route
          path="/attendant"
          element={
            <ProtectedRoute allowedRoles={["ATTENDANT"]}>
              <AttendantDashboard />
            </ProtectedRoute>
          }
        />

        {/* Shared Routes */}
        <Route
          path="/parking"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "ATTENDANT"]}>
              <ParkingList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/car-entry"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "ATTENDANT"]}>
              <CarEntryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/car-exit"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "ATTENDANT"]}>
              <CarExitPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/logs"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "ATTENDANT"]}>
              <LogsPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
