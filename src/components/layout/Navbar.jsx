import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../store/auth";
const Navbar = () => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const logoutHandler = () => {
    dispatch(authActions.logout());

    navigate("/auth", { replace: true });
  };

  return (
    <nav style={styles.navbar}>
      <h1 style={styles.logo}>Expense Tracker</h1>
      <div>
        {isLoggedIn ? (
          <button style={styles.logoutBtn} onClick={logoutHandler}>
            Logout
          </button>
        ) : (
          <Link to="/auth">
            <button style={styles.loginBtn}>Login</button>
          </Link>
        )}
      </div>
    </nav>
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
};

export default Navbar;
