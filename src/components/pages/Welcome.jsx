// src/components/pages/Welcome.jsx
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../store/auth-context";
import UpdateProfile from "../Update_profile";

const Welcome = () => {
  const authCtx = useContext(AuthContext);
  const [isUpdating, setIsUpdating] = useState(false);
  const navigate = useNavigate();

  const logoutHandler = () => {
    authCtx.logout();
    navigate("/auth", { replace: true });
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1>🎉 Welcome to Expense Tracker!</h1>
        <button style={styles.logoutBtn} onClick={logoutHandler}>
          Logout
        </button>
      </div>

      {/* Profile Section */}
      <div style={styles.profileSection}>
        {!isUpdating && (
          <div>
            <p>Your profile is incomplete.</p>
            <button
              style={styles.updateBtn}
              onClick={() => setIsUpdating(true)}
            >
              Update Profile
            </button>
          </div>
        )}

        {isUpdating && <UpdateProfile setIsUpdating={setIsUpdating} />}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "600px",
    margin: "1rem auto",
    padding: "2rem",
    borderRadius: "8px",
    backgroundColor: "#f4f0fa",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
  },
  logoutBtn: {
    padding: "0.5rem 1rem",
    border: "none",
    borderRadius: "4px",
    backgroundColor: "#6200ee",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
  },
  profileSection: {
    marginTop: "1rem",
  },
  updateBtn: {
    padding: "0.5rem 1rem",
    border: "none",
    borderRadius: "4px",
    backgroundColor: "#03a9f4",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: "0.5rem",
  },
};

export default Welcome;
