import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import classes from "./AuthForm.module.css";
import { authActions } from "./store/auth";
import { useDispatch } from "react-redux";

const FIREBASE_KEY = process.env.REACT_APP_FIREBASE_API_KEY;

const AuthForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const confirmPasswordRef = useRef();

  const switchAuthModeHandler = () => {
    setIsLogin((prev) => !prev);
  };

  const loginHandler = (email, password) => {
    setIsLoading(true);
    fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_KEY}`,
      {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
        headers: { "Content-Type": "application/json" },
      }
    )
      .then(async (res) => {
        setIsLoading(false);
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error.message);
        }
        return res.json();
      })
      .then((data) => {
        dispatch(
          authActions.login({ token: data.idToken, userId: data.localId })
        );
        navigate("/welcome", { replace: true });
      })
      .catch((err) => alert(err.message));
  };

  const signupHandler = (email, password, confirmPassword) => {
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setIsLoading(true);
    fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_KEY}`,
      {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
        headers: { "Content-Type": "application/json" },
      }
    )
      .then(async (res) => {
        setIsLoading(false);
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error.message);
        }
        return res.json();
      })
      .then((data) => {
        dispatch(
          authActions.login({ token: data.idToken, userId: data.localId })
        );
        navigate("/welcome", { replace: true });
      })
      .catch((err) => alert(err.message));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;
    const enteredConfirmPassword = confirmPasswordRef.current?.value;

    if (isLogin) {
      loginHandler(enteredEmail, enteredPassword);
    } else {
      signupHandler(enteredEmail, enteredPassword, enteredConfirmPassword);
    }

    // Reset fields
    emailInputRef.current.value = "";
    passwordInputRef.current.value = "";
    if (confirmPasswordRef.current) confirmPasswordRef.current.value = "";
  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={handleSubmit}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" ref={emailInputRef} required />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input
            type="password"
            id="password"
            ref={passwordInputRef}
            required
          />
        </div>
        {!isLogin && (
          <div className={classes.control}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              ref={confirmPasswordRef}
              required
            />
          </div>
        )}

        <div className={classes.actions}>
          {!isLoading && (
            <button className={classes.btn}>
              {isLogin ? "Login" : "Create Account"}
            </button>
          )}
          {isLoading && <p>Sending request...</p>}
        </div>

        <div className={classes.extraActions}>
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>

          <button
            type="button"
            className={classes.forgotPassword}
            onClick={() => navigate("/forget-password")}
          >
            Forgot Password?
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
