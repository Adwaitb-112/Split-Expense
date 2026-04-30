import React, { useEffect, useState } from "react";
import API from "../api/api";

export default function AddExpense() {
  const [loading, setLoading] = useState(false);

  const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [expenses, setExpenses] = useState([]);

  const [groupId, setGroupId] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [amount, setAmount] = useState(0);

  const [splitType, setSplitType] = useState("equal");
  const [splitValues, setSplitValues] = useState({});

  // Fetch groups, users, expenses
  const fetchData = async () => {
    try {
      const g = await API.get("/groups");
      const u = await API.get("/users");
      const e = await API.get("/expenses");

      setGroups(g.data);
      setUsers(u.data);
      setExpenses(e.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Get selected group members
  const groupMembers =
    groups.find(g => g._id === groupId)?.members || [];

  // Calculate splits
  const calculateSplits = () => {
    if (groupMembers.length === 0) return [];

    if (splitType === "equal") {
      const share = Number(amount) / groupMembers.length;
      return groupMembers.map(m => ({
        userId: m._id,
        amount: share
      }));
    }

    if (splitType === "exact") {
      return groupMembers.map(m => ({
        userId: m._id,
        amount: (Number(amount) * Number(splitValues[m._id] || 0)) / 100
      }));
    }

    if (splitType === "percentage") {
      return groupMembers.map(m => ({
        userId: m._id,
        amount: (amount * (splitValues[m._id] || 0)) / 100
      }));
    }
  };

  // Add expense
  const addExpense = async () => {
    if (!groupId) {
      alert("Select a group");
      return;
    }

    if (!paidBy) {
      alert("Select who paid");
      return;
    }

    if (amount <= 0) {
      alert("Amount must be greater than 0");
      return;
    }

    if (groupMembers.length === 0) {
      alert("Group has no members");
      return;
    }

    const splits = calculateSplits();

    const totalSplit = splits.reduce((sum, s) => sum + s.amount, 0);

    if (splitType === "exact" && totalSplit !== amount) {
      alert("Exact split must match total amount");
      return;
    }

    if (splitType === "percentage" && totalSplit !== amount) {
      alert("Percentages must equal 100%");
      return;
    }
    setLoading(true);
    try {
      await API.post("/expenses", {
        groupId,
        description: `${splitType.toUpperCase()} Split Expense`,
        amount,
        paidBy,
        splits
      });
      fetchData();
    }
    catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }

    setGroupId("");
    setPaidBy("");
    setAmount(0);
    setSplitValues({});
    setSplitType("equal");
    fetchData();
  };



  return (
    <div>
      <h2>Add Expense</h2>

      {/* Select Group */}
      <select value={groupId} onChange={e => setGroupId(e.target.value)}>
        <option value="">Select Group</option>
        {groups.map(g => (
          <option key={g._id} value={g._id}>
            {g.name}
          </option>
        ))}
      </select>

      {/* Paid By */}
      <select value={paidBy} onChange={e => setPaidBy(e.target.value)}>
        <option value="">Paid By</option>
        {groupMembers.map(u => (
          <option key={u._id} value={u._id}>
            {u.name}
          </option>
        ))}
      </select>

      {/* Split Type */}
      <select
        value={splitType}
        onChange={e => setSplitType(e.target.value)}
      >
        <option value="equal">Equal Split</option>
        <option value="exact">Exact Split</option>
        <option value="percentage">Percentage Split</option>
      </select>

      {/* Amount */}
      <input
        type="number"
        placeholder="Total Amount"
        value={amount}
        onChange={e => setAmount(Number(e.target.value))}
      />

      {/* Exact / Percentage Inputs */}
      {splitType !== "equal" && (
        <div>
          <h4>
            {splitType === "exact"
              ? "Enter exact amounts"
              : "Enter percentages"}
          </h4>

          {groupMembers.map(m => (
            <div key={m._id}>
              {m.name}
              <input
                type="number"
                placeholder={splitType === "exact" ? "Amount" : "%"}
                value={splitValues[m._id] || ""}
                onChange={e =>
                  setSplitValues({
                    ...splitValues,
                    [m._id]: e.target.value
                  })
                }
              />
            </div>
          ))}
        </div>
      )}

      <button onClick={addExpense}>Add Expense</button>

      {/* Expenses List */}
      <h2>Expenses</h2>
      <ul>
        {expenses.map(exp => (
          <li key={exp._id}>
            <strong>{exp.description}</strong> — ₹{exp.amount}
            <br />
            Paid by: {exp.paidBy?.name}
            <br />
            Group: {exp.groupId?.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
