import { useEffect, useState } from "react";
import API from "../api/api";

export default function ParkingList() {
  const [parkings, setParkings] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    API.get("/parking/available").then((res) => setParkings(res.data));
  }, []);

  return (
    <div>
      <h2>Available Parking</h2>
      <ul>
        {parkings.map((p) => (
          <li key={p.code}>
            <strong>{p.name}</strong> - {p.location}, Spaces:{" "}
            {p.availableSpaces}, Fee/hr: {p.feePerHour}
          </li>
        ))}
      </ul>
    </div>
  );
}
