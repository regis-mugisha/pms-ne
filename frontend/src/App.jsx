import { BrowserRouter, Route, Routes } from "react-router-dom";
import CarEntryPage from "./pages/CarEntryPage";
import CarExitPage from "./pages/CarExitPage";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";
import ParkingList from "./pages/ParkingList";
import ParkingRegisterPage from "./pages/ParkingRegisterPage";
import RegisterPage from "./pages/RegisterPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/parking" element={<ParkingList />} />
        <Route path="/car-entry" element={<CarEntryPage />} />
        <Route path="/car-exit" element={<CarExitPage />} />
        <Route path="/register-parking" element={<ParkingRegisterPage />} />;
      </Routes>
    </BrowserRouter>
  );
}

export default App;
