import { useContext, useState , useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../store/auth-context";
import UpdateProfile from "../Update_profile";


const Welcome = () => {
  const authCtx = useContext(AuthContext);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(null); 
  const navigate = useNavigate();

  const logoutHandler = () => {
    authCtx.logout();
    navigate("/auth", { replace: true });
  };

  // Check email verification status
useEffect(() => {
  const interval = setInterval(async () => {
    try {
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${process.env.REACT_APP_FIREBASE_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken: authCtx.token }),
        }
      );
      const data = await response.json();
      console.log("Polling lookup response:", data);

      if (data?.users?.[0]?.emailVerified) {
        setIsEmailVerified(true);
        clearInterval(interval);
      }
    } catch (err) {
      console.error("Polling error:", err);
    }
  }, 5000);

  return () => clearInterval(interval);
}, [authCtx.token]);


  const sendVerificationHandler = async () => {
    console.log("Sending verification email...");
    try {
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${process.env.REACT_APP_FIREBASE_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            requestType: "VERIFY_EMAIL",
            idToken: authCtx.token,
          }),
        }
      );

      const data = await response.json();
      console.log("Send verification response:", data);

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
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1>🎉 Welcome to Expense Tracker!</h1>
        <button style={styles.logoutBtn} onClick={logoutHandler}>
          Logout
        </button>
      </div>

      {/* Email Verification Section */}
      {isEmailVerified === false && (
        <div style={styles.verifySection}>
          <p style={{ color: "red", fontWeight: "bold" }}>
            Your email is not verified. Please verify to continue.
          </p>
          <button style={styles.verifyBtn} onClick={sendVerificationHandler}>
            Verify Email
          </button>
        </div>
      )}
      {isEmailVerified  && (
        <div style={styles.verifiedSection}>
          <p style={{ color: "green", fontWeight: "bold" }}>
            Your email is verified. You can now access all features.
          </p>
         
        </div>
      )}
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
  verifySection: {
    marginTop: "1rem",
    padding: "1rem",
    border: "1px solid red",
    borderRadius: "6px",
    backgroundColor: "#ffe5e5",
  },
    verifiedSection: {
    marginTop: "1rem",
    padding: "1rem",
    border: "1px solid green",
    borderRadius: "6px",
    backgroundColor: "#e5ffe5",
  },
  verifyBtn: {
    padding: "0.5rem 1rem",
    border: "none",
    borderRadius: "4px",
    backgroundColor: "#e53935",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: "0.5rem",
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
