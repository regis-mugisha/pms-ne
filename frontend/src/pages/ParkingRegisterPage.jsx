import { useState } from "react";
import API from "../api/api";

export default function ParkingRegisterPage() {
  const [parking, setParking] = useState({
    code: "",
    name: "",
    availableSpaces: "",
    location: "",
    feePerHour: "",
  });

  const handleRegister = async () => {
    try {
      await API.post("/parking", {
        ...parking,
        availableSpaces: Number(parking.availableSpaces),
        feePerHour: Number(parking.feePerHour),
      });
      alert("Parking registered successfully!");
    } catch (err) {
      alert(`Parking Registration failed: ${err.message}`);
    }
  };

  return (
    <div>
      <h2>Register New Parking (Admin)</h2>
      <input
        placeholder="Code"
        onChange={(e) => setParking({ ...parking, code: e.target.value })}
      />
      <input
        placeholder="Name"
        onChange={(e) => setParking({ ...parking, name: e.target.value })}
      />
      <input
        placeholder="Available Spaces"
        onChange={(e) =>
          setParking({ ...parking, availableSpaces: e.target.value })
        }
      />
      <input
        placeholder="Location"
        onChange={(e) => setParking({ ...parking, location: e.target.value })}
      />
      <input
        placeholder="Fee per Hour"
        onChange={(e) => setParking({ ...parking, feePerHour: e.target.value })}
      />
      <button onClick={handleRegister}>Create Parking</button>
    </div>
  );
}
