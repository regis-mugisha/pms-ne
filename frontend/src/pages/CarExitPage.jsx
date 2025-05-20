import { useState } from "react";
import API from "../api/api";

export default function CarExitPage() {
  const [entryId, setEntryId] = useState("");
  const [bill, setBill] = useState(null);

  const handleExit = async () => {
    try {
      const res = await API.put(`/car/exit/${entryId}`);
      setBill(res.data);
    } catch {
      alert("Exit failed");
    }
  };

  return (
    <div>
      <h2>Register Car Exit</h2>
      <input
        placeholder="Entry ID"
        onChange={(e) => setEntryId(e.target.value)}
      />
      <button onClick={handleExit}>Exit Car</button>

      {bill && (
        <div>
          <p>Exited at: {new Date(bill.exitTime).toLocaleString()}</p>
          <p>Charged Amount: ${bill.chargedAmount}</p>
        </div>
      )}
    </div>
  );
}
