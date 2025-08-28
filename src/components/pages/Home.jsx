import { useContext } from "react";
// import {  useNavigate } from "react-router-dom";
import AuthContext from "../store/auth-context";

const Home = () => {
  const authCtx = useContext(AuthContext);
  // const navigate = useNavigate();

  

  return (
    <div style={styles.container}>
   

      {/* Page Content */}
      <main style={styles.main}>
        <h1>Welcome to MyApp 🚀</h1>
        <p>
          {authCtx.isLoggedIn
            ? "You are logged in! Enjoy browsing."
            : "Please log in to continue."}
        </p>
      </main>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    minHeight: "80vh",
    display: "flex",
    flexDirection: "column",
  },
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 2rem",
    backgroundColor: "#6200ee",
    color: "white",
    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
  },
  logo: {
    margin: 0,
    fontSize: "1.5rem",
  },
  loginBtn: {
    padding: "0.5rem 1rem",
    border: "none",
    borderRadius: "4px",
    backgroundColor: "white",
    color: "#6200ee",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "0.3s",
  },
  logoutBtn: {
    padding: "0.5rem 1rem",
    border: "none",
    borderRadius: "4px",
    backgroundColor: "#e53935",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "0.3s",
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "2rem",
    textAlign: "center",
    padding: "0 1rem",
  },
};

export default Home;
