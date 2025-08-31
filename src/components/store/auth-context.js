import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = React.createContext({
  token: "",
  isLoggedIn: false,
  login: (token, userId) => {},
  logout: () => {},
});

const EXP_MS = 5 * 60 * 1000; // 5 minutes auto-expiry

export const AuthContextProvider = (props) => {
  const initialToken = localStorage.getItem("token");
  const [token, setToken] = useState(initialToken);
  const [userId, setUserId] = useState(null);

  const navigate = useNavigate();

  const userIsLoggedIn = !!token;

  const timerRef = useRef(null);

  const clearTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
  };

const loginHandler = (newToken, userId) => {
  const expiryAt = Date.now() + EXP_MS;
  localStorage.setItem("token", newToken);
  localStorage.setItem("userId", userId);
  localStorage.setItem("tokenExpiry", String(expiryAt));
  setToken(newToken);
  setUserId(userId);
  clearTimer();
  timerRef.current = setTimeout(() => logoutHandler(), EXP_MS);

  console.log("✅ User logged in, token stored"); // log added
};

const logoutHandler = () => {
  clearTimer();
  setToken(null);
  localStorage.removeItem("token");
  localStorage.removeItem("tokenExpiry");
  console.log("🚪 User logged out"); // log added
  navigate("/", { replace: true });
};

  useEffect(() => {
    const expiry = Number(localStorage.getItem("tokenExpiry") || 0);
    if (!initialToken || !expiry || Date.now() >= expiry) {
      logoutHandler(); // token expired or missing
      return;
    }

    const remaining = Math.max(0, expiry - Date.now());
    timerRef.current = setTimeout(() => logoutHandler(), remaining);

    return () => clearTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const contextValue = {
    token,
      userId: userId,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
