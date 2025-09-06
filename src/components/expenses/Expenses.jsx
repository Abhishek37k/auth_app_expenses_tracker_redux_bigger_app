import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { expenseActions } from "../store/expense";
import { themeActions } from "../store/theme"; // Make sure you have theme reducer
import React from "react";

const Expenses = () => {
  const dispatch = useDispatch();

  // Auth state
  const token = useSelector((state) => state.auth.token);
  const userId = useSelector((state) => state.auth.userId);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  // Expenses state
  const expenses = useSelector((state) => state.expense.expenses);

  // Theme state
  const darkMode = useSelector((state) => state.theme.darkMode);

  // Local state
  const [money, setMoney] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Food");
  const [editId, setEditId] = useState(null);

  const totalExpenses = expenses.reduce(
    (sum, exp) => sum + Number(exp.money),
    0
  );

  // Fetch expenses from Firebase
  useEffect(() => {
    if (!userId || !token) return;
    fetch(
      `https://expense-tracker-react-875b9-default-rtdb.firebaseio.com/expenses/${userId}.json?auth=${token}`
    )
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch expenses");
        return res.json();
      })
      .then((data) => {
        if (!data) {
          dispatch(expenseActions.setExpenses([]));
          return;
        }
        const loaded = Object.entries(data).map(([key, value]) => ({
          id: key,
          ...value,
        }));
        dispatch(expenseActions.setExpenses(loaded.reverse()));
      })
      .catch((err) => alert(err.message));
  }, [userId, token, dispatch]);

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
        `https://expense-tracker-react-875b9-default-rtdb.firebaseio.com/expenses/${userId}/${editId}.json?auth=${token}`,
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
          dispatch(expenseActions.updateExpense({ id: editId, ...expenseData }));
          resetForm();
        })
        .catch((err) => alert(err.message));
    } else {
      // Add new expense (POST)
      fetch(
        `https://expense-tracker-react-875b9-default-rtdb.firebaseio.com/expenses/${userId}.json?auth=${token}`,
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
          dispatch(expenseActions.addExpense({ id: data.name, ...expenseData }));
          resetForm();
        })
        .catch((err) => alert(err.message));
    }
  };

  // Delete expense
  const deleteHandler = (id) => {
    fetch(
      `https://expense-tracker-react-875b9-default-rtdb.firebaseio.com/expenses/${userId}/${id}.json?auth=${token}`,
      { method: "DELETE" }
    )
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete expense");
        dispatch(expenseActions.deleteExpense(id));
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

  // Toggle dark/light theme
  const changeThemeHandler = () => {
    dispatch(themeActions.toggleTheme());
  };

  // Download expenses as CSV
  const downloadCSV = () => {
    const csvRows = [
      ["Money", "Description", "Category"],
      ...expenses.map((exp) => [exp.money, exp.description, exp.category]),
    ];
    const csvContent = csvRows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "expenses.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!isLoggedIn) {
    return (
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <h2>Please login to add expenses</h2>
      </div>
    );
  }

  return (
    <div
      style={{
        ...styles.container,
        backgroundColor: darkMode ? "#222" : "#f4f0fa",
        color: darkMode ? "#fff" : "#000",
      }}
    >
      <h2>Daily Expenses Tracker</h2>
      <form style={styles.form} onSubmit={submitHandler}>
        <input
          type="number"
          placeholder="Money Spent"
          value={money}
          onChange={(e) => setMoney(e.target.value)}
          style={{
            ...styles.input,
            backgroundColor: darkMode ? "#333" : "#fff",
            color: darkMode ? "#fff" : "#000",
          }}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{
            ...styles.input,
            backgroundColor: darkMode ? "#333" : "#fff",
            color: darkMode ? "#fff" : "#000",
          }}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{
            ...styles.input,
            backgroundColor: darkMode ? "#333" : "#fff",
            color: darkMode ? "#fff" : "#000",
          }}
        >
          <option value="Food">Food</option>
          <option value="Petrol">Petrol</option>
          <option value="Salary">Salary</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Other">Other</option>
        </select>
        <button
          type="submit"
          style={{
            ...styles.button,
            backgroundColor: darkMode ? "#6200ee" : "#6200ee",
            color: "#fff",
          }}
        >
          {editId ? "Update Expense" : "Add Expense"}
        </button>
        {editId && (
          <button
            type="button"
            style={{
              ...styles.button,
              backgroundColor: "#f44336",
              marginTop: "0.5rem",
            }}
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
          <li
            key={exp.id}
            style={{
              ...styles.listItem,
              backgroundColor: darkMode ? "#333" : "#fff",
              color: darkMode ? "#fff" : "#000",
            }}
          >
            <div style={styles.expenseInfo}>
              <span style={styles.money}>₹{exp.money}</span>
              <span>{exp.description}</span>
            </div>
            <div style={styles.actionButtons}>
              <span style={styles.categoryBadge}>{exp.category}</span>
              <button
                style={styles.editBtn}
                onClick={() => editHandler(exp)}
              >
                Edit
              </button>
              <button
                style={styles.deleteBtn}
                onClick={() => deleteHandler(exp.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Premium Features */}
      {totalExpenses > 10000 && (
        <div style={{ marginTop: "1rem" }}>
          <button
            style={styles.premiumBtn}
            onClick={changeThemeHandler}
          >
            {darkMode ? "Switch to Light Mode" : "Activate Premium / Dark Mode"}
          </button>
          <button
            style={{ ...styles.premiumBtn, marginLeft: "1rem" }}
            onClick={downloadCSV}
          >
            Download Expenses
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: 600,
    margin: "2rem auto",
    padding: "2rem",
    borderRadius: 10,
    boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "0.7rem",
    marginTop: "1rem",
  },
  input: {
    padding: "0.6rem 0.8rem",
    borderRadius: 6,
    border: "1px solid #ccc",
    fontSize: "1rem",
    outline: "none",
  },
  button: {
    padding: "0.6rem",
    borderRadius: 6,
    border: "none",
    fontWeight: "bold",
    cursor: "pointer",
  },
  list: {
    listStyle: "none",
    padding: 0,
    marginTop: "2rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.8rem",
  },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.8rem 1rem",
    borderRadius: 8,
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
  },
  expenseInfo: { display: "flex", flexDirection: "column", textAlign: "left" },
  money: { fontWeight: "bold", fontSize: "1.1rem", color: "#6200ee" },
  categoryBadge: {
    padding: "0.2rem 0.5rem",
    borderRadius: 6,
    backgroundColor: "#e0e0e0",
    fontSize: "0.8rem",
    fontWeight: "bold",
    marginRight: "0.5rem",
  },
  actionButtons: { display: "flex", alignItems: "center", gap: "0.5rem" },
  editBtn: {
    padding: "0.3rem 0.5rem",
    borderRadius: 6,
    border: "none",
    backgroundColor: "#03a9f4",
    color: "white",
    cursor: "pointer",
  },
  deleteBtn: {
    padding: "0.3rem 0.5rem",
    borderRadius: 6,
    border: "none",
    backgroundColor: "#f44336",
    color: "white",
    cursor: "pointer",
  },
  premiumBtn: {
    padding: "0.6rem 1.2rem",
    border: "none",
    borderRadius: 6,
    backgroundColor: "#ff9800",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
  },
};

export default Expenses;
