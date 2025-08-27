import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../store/auth-context";

const Home = () => {
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  const logoutHandler = () => {
    authCtx.logout();
    navigate("/auth", { replace: true });
  };

  return (
    <div>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <h2 style={styles.logo}>MyApp</h2>
        <div>
          {!authCtx.isLoggedIn && (
            <Link to="/auth">
              <button style={styles.btn}>Login</button>
            </Link>
          )}
          {authCtx.isLoggedIn && (
            <button style={styles.btn} onClick={logoutHandler}>
              Logout
            </button>
          )}
        </div>
      </nav>

      {/* Page Content */}
      <main style={styles.main}>
        <h1>Welcome to the Home Page 🚀</h1>
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
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 2rem",
    backgroundColor: "#6200ee",
    color: "white",
  },
  logo: {
    margin: 0,
  },
  btn: {
    padding: "0.5rem 1rem",
    border: "none",
    borderRadius: "4px",
    backgroundColor: "white",
    color: "#6200ee",
    cursor: "pointer",
    fontWeight: "bold",
  },
  main: {
    marginTop: "2rem",
    textAlign: "center",
  },
};

export default Home;
