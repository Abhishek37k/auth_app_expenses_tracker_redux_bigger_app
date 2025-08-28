import { useState, useContext } from "react";
import AuthContext from "../store/auth-context";

const Expenses = () => {
  const authCtx = useContext(AuthContext);
  const [money, setMoney] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Food");
  const [expenses, setExpenses] = useState([]);

  if (!authCtx.isLoggedIn) {
    return (
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <h2>Please login to add expenses</h2>
      </div>
    );
  }

  const submitHandler = (e) => {
    e.preventDefault();

    if (!money || !description) {
      alert("Please fill in all fields");
      return;
    }

    const newExpense = {
      id: Math.random().toString(),
      money,
      description,
      category,
    };

    setExpenses((prev) => [newExpense, ...prev]);
    setMoney("");
    setDescription("");
    setCategory("Food");
  };

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
          Add Expense
        </button>
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
      <span style={styles.categoryBadge}>{exp.category}</span>
    </li>
  ))}
</ul>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "600px",
    margin: "2rem auto",
    padding: "2rem",
    backgroundColor: "#f4f0fa",
    borderRadius: "10px",
    boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
    textAlign: "center",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "0.7rem",
    marginTop: "1rem",
  },
  input: {
    padding: "0.6rem 0.8rem",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "1rem",
    outline: "none",
    transition: "border-color 0.3s ease",
  },
  inputFocus: {
    borderColor: "#6200ee",
  },
  button: {
    padding: "0.6rem",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#6200ee",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "background-color 0.3s ease",
  },
  buttonHover: {
    backgroundColor: "#3700b3",
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
    borderRadius: "8px",
    backgroundColor: "white",
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
  },
  expenseInfo: {
    display: "flex",
    flexDirection: "column",
    textAlign: "left",
  },
  money: {
    fontWeight: "bold",
    fontSize: "1.1rem",
    color: "#6200ee",
  },
  categoryBadge: {
    padding: "0.2rem 0.5rem",
    borderRadius: "6px",
    backgroundColor: "#e0e0e0",
    fontSize: "0.8rem",
    fontWeight: "bold",
  },
};

export default Expenses;
