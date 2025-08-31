import { useState, useEffect, useContext } from "react";
import AuthContext from "../store/auth-context";

const Expenses = () => {
  const authCtx = useContext(AuthContext);
  const [money, setMoney] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Food");
  const [expenses, setExpenses] = useState([]);
  const [editId, setEditId] = useState(null); // currently editing expense

  // Fetch expenses from Firebase on load
  useEffect(() => {
    if (!authCtx.userId || !authCtx.token) return;

    fetch(
      `https://expense-tracker-react-875b9-default-rtdb.firebaseio.com/expenses/${authCtx.userId}.json?auth=${authCtx.token}`
    )
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch expenses");
        return res.json();
      })
      .then((data) => {
        if (!data) return setExpenses([]);
        const loaded = Object.entries(data).map(([key, value]) => ({
          id: key,
          ...value,
        }));
        setExpenses(loaded.reverse()); // newest first
      })
      .catch((err) => alert(err.message));
  }, [authCtx.userId, authCtx.token]);

  const resetForm = () => {
    setMoney("");
    setDescription("");
    setCategory("Food");
    setEditId(null);
  };

  // Add or Edit Expense
  const submitHandler = (e) => {
    e.preventDefault();
    if (!money || !description) return alert("Please fill all fields");

    const expenseData = { money, description, category };

    if (editId) {
      // Edit existing expense (PUT)
      fetch(
        `https://expense-tracker-react-875b9-default-rtdb.firebaseio.com/expenses/${authCtx.userId}/${editId}.json?auth=${authCtx.token}`,
        {
          method: "PUT",
          body: JSON.stringify(expenseData),
          headers: { "Content-Type": "application/json" },
        }
      )
        .then((res) => {
          if (!res.ok) throw new Error("Failed to update expense");
          return res.json();
        })
        .then(() => {
          setExpenses((prev) =>
            prev.map((exp) => (exp.id === editId ? { id: editId, ...expenseData } : exp))
          );
          console.log("Expense successfully updated");
          resetForm();
        })
        .catch((err) => alert(err.message));
    } else {
      // Add new expense (POST)
      fetch(
        `https://expense-tracker-react-875b9-default-rtdb.firebaseio.com/expenses/${authCtx.userId}.json?auth=${authCtx.token}`,
        {
          method: "POST",
          body: JSON.stringify(expenseData),
          headers: { "Content-Type": "application/json" },
        }
      )
        .then((res) => {
          if (!res.ok) throw new Error("Failed to add expense");
          return res.json();
        })
        .then((data) => {
          setExpenses((prev) => [{ id: data.name, ...expenseData }, ...prev]);
          console.log("Expense successfully added");
          resetForm();
        })
        .catch((err) => alert(err.message));
    }
  };

  // Delete expense
  const deleteHandler = (id) => {
    fetch(
      `https://expense-tracker-react-875b9-default-rtdb.firebaseio.com/expenses/${authCtx.userId}/${id}.json?auth=${authCtx.token}`,
      { method: "DELETE" }
    )
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete expense");
        setExpenses((prev) => prev.filter((exp) => exp.id !== id));
        console.log("Expense successfully deleted");
      })
      .catch((err) => alert(err.message));
  };

  // Start editing an expense
  const editHandler = (expense) => {
    setMoney(expense.money);
    setDescription(expense.description);
    setCategory(expense.category);
    setEditId(expense.id);
  };

  if (!authCtx.isLoggedIn) {
    return (
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <h2>Please login to add expenses</h2>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2>Daily Expenses Tracker</h2>
      <form style={styles.form} onSubmit={submitHandler}>
        <input
          type="number"
          placeholder="Money Spent"
          value={money}
          onChange={(e) => setMoney(e.target.value)}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={styles.input}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={styles.input}
        >
          <option value="Food">Food</option>
          <option value="Petrol">Petrol</option>
          <option value="Salary">Salary</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Other">Other</option>
        </select>
        <button type="submit" style={styles.button}>
          {editId ? "Update Expense" : "Add Expense"}
        </button>
        {editId && (
          <button
            type="button"
            style={{ ...styles.button, backgroundColor: "#f44336", marginTop: "0.5rem" }}
            onClick={resetForm}
          >
            Cancel
          </button>
        )}
      </form>

      <h3 style={{ marginTop: "2rem" }}>Your Expenses:</h3>
      {expenses.length === 0 && <p>No expenses added yet.</p>}
      <ul style={styles.list}>
        {expenses.map((exp) => (
          <li key={exp.id} style={styles.listItem}>
            <div style={styles.expenseInfo}>
              <span style={styles.money}>${exp.money}</span>
              <span>{exp.description}</span>
            </div>
            <div style={styles.actionButtons}>
              <span style={styles.categoryBadge}>{exp.category}</span>
              <button style={styles.editBtn} onClick={() => editHandler(exp)}>
                Edit
              </button>
              <button style={styles.deleteBtn} onClick={() => deleteHandler(exp.id)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

const styles = {
  container: { maxWidth: 600, margin: "2rem auto", padding: "2rem", backgroundColor: "#f4f0fa", borderRadius: 10, boxShadow: "0 6px 15px rgba(0,0,0,0.1)", textAlign: "center" },
  form: { display: "flex", flexDirection: "column", gap: "0.7rem", marginTop: "1rem" },
  input: { padding: "0.6rem 0.8rem", borderRadius: 6, border: "1px solid #ccc", fontSize: "1rem", outline: "none" },
  button: { padding: "0.6rem", borderRadius: 6, border: "none", backgroundColor: "#6200ee", color: "white", cursor: "pointer", fontWeight: "bold" },
  list: { listStyle: "none", padding: 0, marginTop: "2rem", display: "flex", flexDirection: "column", gap: "0.8rem" },
  listItem: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.8rem 1rem", borderRadius: 8, backgroundColor: "white", boxShadow: "0 2px 6px rgba(0,0,0,0.05)" },
  expenseInfo: { display: "flex", flexDirection: "column", textAlign: "left" },
  money: { fontWeight: "bold", fontSize: "1.1rem", color: "#6200ee" },
  categoryBadge: { padding: "0.2rem 0.5rem", borderRadius: 6, backgroundColor: "#e0e0e0", fontSize: "0.8rem", fontWeight: "bold", marginRight: "0.5rem" },
  actionButtons: { display: "flex", alignItems: "center", gap: "0.5rem" },
  editBtn: { padding: "0.3rem 0.5rem", borderRadius: 6, border: "none", backgroundColor: "#03a9f4", color: "white", cursor: "pointer" },
  deleteBtn: { padding: "0.3rem 0.5rem", borderRadius: 6, border: "none", backgroundColor: "#f44336", color: "white", cursor: "pointer" },
};

export default Expenses;
