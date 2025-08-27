// src/components/pages/Welcome.jsx
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../store/auth-context";

const Welcome = () => {
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  const logoutHandler = () => {
    authCtx.logout();
    navigate("/auth", { replace: true });
  };

  return (
    <div style={styles.container}>
      <h1>🎉 Welcome to Expense Tracker!</h1>
      <p>You are successfully logged in.</p>
      <button style={styles.btn} onClick={logoutHandler}>
        Logout
      </button>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    marginTop: "5rem",
  },
  btn: {
    padding: "0.5rem 1rem",
    border: "none",
    borderRadius: "4px",
    backgroundColor: "#6200ee",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: "1rem",
  },
};

export default Welcome;
