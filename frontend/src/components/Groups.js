import React, { useEffect, useState } from "react";
import API from "../api/api";

export default function Groups() {
  const [groupName, setGroupName] = useState("");
  const [users, setUsers] = useState([]);
  const [members, setMembers] = useState([]);
  const [groups, setGroups] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await API.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load users");
    }
  };

  const fetchGroups = async () => {
    try {
      const res = await API.get("/groups");
      setGroups(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load groups");
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await Promise.all([fetchUsers(), fetchGroups()]);
      setLoading(false);
    };

    load();
  }, []);

  const createGroup = async () => {
    if (!groupName.trim()) {
      alert("Group name required");
      return;
    }

    if (members.length === 0) {
      alert("Select at least one member");
      return;
    }

    try {
      await API.post("/groups", {
        name: groupName.trim(),
        members
      });

      setGroupName("");
      setMembers([]);
      fetchGroups();
      alert("Group created");
    } catch (err) {
      console.error(err);
      alert("Failed to create group");
    }
  };

  return (
    <div>
      <h2>Create Group</h2>

      <input
        placeholder="Group Name"
        value={groupName}
        onChange={e => setGroupName(e.target.value)}
      />

      <h4>Select Members</h4>
      {users.map(u => (
        <div key={u._id}>
          <input
            type="checkbox"
            checked={members.includes(u._id)}
            onChange={e => {
              if (e.target.checked) {
                if (!members.includes(u._id)) {
                  setMembers(prev => [...prev, u._id]);
                }
              } else {
                setMembers(prev => prev.filter(id => id !== u._id));
              }
            }}
          />
          {u.name}
        </div>
      ))}

      <button disabled={loading} onClick={createGroup}>
        Create Group
      </button>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      {/* ✅ SHOW GROUPS */}
      <h2>Existing Groups</h2>
      <ul>
        {groups.map(g => (
          <li key={g._id}>
            <strong>{g.name}</strong> — Members:{" "}
            {g.members?.map((m, i) => (
              <span key={m._id || i}>
                {m.name || "Unknown"}
                {i < g.members.length - 1 ? ", " : ""}
              </span>
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
}
