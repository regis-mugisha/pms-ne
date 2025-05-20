import { useState } from "react";
import API from "../api/api";

export default function CarEntryPage() {
  const [data, setData] = useState({
    plateNumber: "",
    parkingCode: "",
  });

  const handleEntry = async () => {
    try {
      const res = await API.post("/car/entry", data);
      alert(`Car entered. Ticket ID: ${res.data.id}`);
    } catch {
      alert("Entry failed");
    }
  };

  return (
    <div>
      <h2>Register Car Entry</h2>
      <input
        placeholder="Plate Number"
        onChange={(e) => setData({ ...data, plateNumber: e.target.value })}
      />
      <input
        placeholder="Parking Code"
        onChange={(e) => setData({ ...data, parkingCode: e.target.value })}
      />
      <button onClick={handleEntry}>Enter Car</button>
    </div>
  );
}
