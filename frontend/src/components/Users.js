import React, { useEffect, useState } from "react";
import API from "../api/api";

export default function Users() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await API.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const addUser = async () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      alert("Name is required");
      return;
    }

    if (!trimmedEmail) {
      alert("Email is required");
      return;
    }

    // basic email validation (not perfect but better than nothing)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(trimmedEmail)) {
      alert("Invalid email format");
      return;
    }

    try {
      setLoading(true);

      const exists = users.some(
        u => u.email.toLowerCase() === trimmedEmail.toLowerCase()
      );

      if (exists) {
        alert("User already exists");
        return;
      }

      await API.post("/users", {
        name: trimmedName,
        email: trimmedEmail
      });

      setName("");
      setEmail("");
      fetchUsers();
      alert("User added");
    } catch (err) {
      console.error(err);
      alert("Failed to add user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h2>Users</h2>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <input placeholder="Name" value={name}
        onChange={e => setName(e.target.value)} />
      <input placeholder="Email" value={email}
        onChange={e => setEmail(e.target.value)} />
      <button disabled={loading || !name.trim() || !email.trim()} onClick={addUser}>
        {loading ? "Adding..." : "Add User"}
      </button>

      <ul>
        {users.sort((a, b) => a.name.localeCompare(b.name))
          .map(u => (
            <li key={u._id || Math.random()}>
              <strong>{u.name || "Unknown"}</strong> — {u.email || "No email"}
            </li>
          ))}
      </ul>
    </div>
  );
}
