import React, { useRef, useState } from "react";

const FIREBASE_KEY = process.env.REACT_APP_FIREBASE_API_KEY;

const ForgetPassword = () => {
  const emailRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${FIREBASE_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            requestType: "PASSWORD_RESET",
            email: emailRef.current.value,
          }),
        }
      );

      const data = await response.json();
      setIsLoading(false);

      if (!response.ok) {
        throw new Error(data.error.message);
      }

      setMessage("📧 Reset link sent! Check your email inbox.");
    } catch (err) {
      setIsLoading(false);
      setMessage("❌ " + err.message);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Forgot Password</h1>
      <p style={styles.text}>
        Please enter your email address to reset your password.
      </p>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formControl}>
          <label htmlFor="email" style={styles.label}>Email:</label>
          <input
            type="email"
            id="email"
            ref={emailRef}
            required
            style={styles.input}
          />
        </div>
        <button type="submit" style={styles.button} disabled={isLoading}>
          {isLoading ? "Sending..." : "Reset Password"}
        </button>
      </form>
      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "400px",
    margin: "3rem auto",
    padding: "2rem",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
    backgroundColor: "#f9f9f9",
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    marginBottom: "0.5rem",
    color: "#6200ee",
  },
  text: {
    marginBottom: "1.5rem",
    fontSize: "0.95rem",
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  formControl: {
    display: "flex",
    flexDirection: "column",
    textAlign: "left",
  },
  label: {
    marginBottom: "0.3rem",
    fontWeight: "bold",
  },
  input: {
    padding: "0.5rem",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "1rem",
  },
  button: {
    padding: "0.6rem 1rem",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#6200ee",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
  },
  message: {
    marginTop: "1rem",
    fontWeight: "bold",
  },
};

export default ForgetPassword;
