import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import Users from "./components/Users";
import Groups from "./components/Groups";
import AddExpense from "./components/AddExpense";
import Balances from "./components/Balances";

function App() {
  return (
    <Router>
      <div style={{ maxWidth: "800px", margin: "auto" }}>
        <h1>Expense Sharing App</h1>

        {/* Navigation */}
        <nav style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
          <NavLink to="/users">Users</NavLink>
          <NavLink to="/groups">Groups</NavLink>
          <NavLink to="/add-expense">Add Expense</NavLink>
          <NavLink to="/balances">Balances</NavLink>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Users />} />
          <Route path="/users" element={<Users />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/add-expense" element={<AddExpense />} />
          <Route path="/balances" element={<Balances />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;