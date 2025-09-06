import {  useState, useEffect } from "react";
import { useSelector } from "react-redux";
import UpdateProfile from "../Update_profile";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const token = useSelector((state) => state.auth.token);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(null);
  const navigate = useNavigate();

  // Check email verification status
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(
          `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${process.env.REACT_APP_FIREBASE_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idToken: token }),
          }
        );
        const data = await response.json();
        if (data?.users?.[0]?.emailVerified) {
          setIsEmailVerified(true);
          clearInterval(interval);
        }
      } catch (err) {
        console.error("Polling error:", err);
        setIsEmailVerified(false);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [token]);

  const sendVerificationHandler = async () => {
    try {
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${process.env.REACT_APP_FIREBASE_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            requestType: "VERIFY_EMAIL",
            idToken: token,
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        alert("Verification email sent! Please check your inbox.");
      } else {
        alert(data.error.message || "Failed to send verification email.");
      }
    } catch (err) {
      console.error("Error sending verification email:", err);
    }
  };

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <h1>🎉 Welcome to Expense Tracker!</h1>
        <button
          style={styles.expenseBtn}
          onClick={() => navigate("/expenses")}
        >
          Add Expense
        </button>
      </div>

      {/* Email Verification */}
      {isEmailVerified === false && (
        <div style={styles.alertRed}>
          <p>Your email is not verified. Please verify to continue.</p>
          <button style={styles.verifyBtn} onClick={sendVerificationHandler}>
            Verify Email
          </button>
        </div>
      )}
      {isEmailVerified && (
        <div style={styles.alertGreen}>
          <p>Your email is verified. You can now access all features.</p>
        </div>
      )}

      {/* Profile Section */}
      <div style={styles.profile}>
        {isUpdating ? (
          <UpdateProfile setIsUpdating={setIsUpdating} />
        ) : (
          <button
            style={styles.updateBtn}
            onClick={() => setIsUpdating(true)}
          >
            Update Profile
          </button>
        )}
      </div>
    </div>
  );
};

const styles = {
  page: {
    maxWidth: "700px",
    margin: "2rem auto",
    padding: "2rem",
    borderRadius: "10px",
    backgroundColor: "#f9f9f9",
    boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
    textAlign: "center",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2rem",
  },
  expenseBtn: {
    padding: "0.6rem 1.2rem",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#6200ee",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "background-color 0.3s ease",
  },
  expenseBtnHover: {
    backgroundColor: "#3700b3",
  },
  alertRed: {
    margin: "1rem 0",
    padding: "1rem",
    borderRadius: "8px",
    backgroundColor: "#ffe5e5",
    border: "1px solid #ff4d4d",
    color: "#d8000c",
    fontWeight: "bold",
  },
  alertGreen: {
    margin: "1rem 0",
    padding: "1rem",
    borderRadius: "8px",
    backgroundColor: "#e5ffe5",
    border: "1px solid #4CAF50",
    color: "#256029",
    fontWeight: "bold",
  },
  verifyBtn: {
    marginTop: "0.5rem",
    padding: "0.5rem 1.2rem",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#e53935",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "background-color 0.3s ease",
  },
  profile: {
    marginTop: "2rem",
  },
  updateBtn: {
    padding: "0.6rem 1.2rem",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#03a9f4",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "background-color 0.3s ease",
  },
};

export default Welcome;
