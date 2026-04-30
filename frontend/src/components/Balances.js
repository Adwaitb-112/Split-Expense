import React, { useEffect, useState } from "react";
import API from "../api/api";

export default function Balances() {
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBalances = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await API.get("/expenses/balances");
      setBalances(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load balances");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalances();
  }, []);

  return (
    <div>
      <h2>Balances</h2>

      {loading && <p>Loading balances...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && balances.length === 0 && (
        <p>No balances yet</p>
      )}

      {!loading && !error && balances.length > 0 && (
        <ul>
          {balances
            .sort((a, b) => b.amount - a.amount)
            .map((b, index) => (
              <li key={`${b.from}-${b.to}-${index}`}>
                <strong>{b.from || "Unknown"}</strong> owes{" "}
                <strong>{b.to || "Unknown"}</strong>{" "}
                ₹{Number(b.amount).toFixed(2)}
              </li>
            ))}
        </ul>
      )}
      <button onClick={fetchBalances}>Refresh</button>
    </div>
  );
}
