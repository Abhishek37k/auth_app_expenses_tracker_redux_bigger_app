import React, { useState, useContext } from "react";
import { useEffect } from "react";
import AuthContext from "../components/store/auth-context";

const FIREBASE_KEY = process.env.REACT_APP_FIREBASE_API_KEY;

const UpdateProfile = ({ setIsUpdating }) => {
  const authCtx = useContext(AuthContext);
  const [fullName, setFullName] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Fetch existing user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${FIREBASE_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idToken: authCtx.token }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          console.error("Error fetching user data:", data);
          throw new Error(data.error?.message || "Failed to fetch user data");
        }

        if (data.users && data.users.length > 0) {
          const user = data.users[0];
          setFullName(user.displayName || "");
          setPhotoUrl(user.photoUrl || "");
          console.log("✅ User data loaded:", user);
        }
      } catch (err) {
        console.error("Error in fetching user data:", err);
        alert("Error loading profile: " + err.message);
      }
    };

    fetchUserData();
  }, [authCtx.token]);

  const updateHandler = async () => {
    if (!fullName && !photoUrl) {
      alert("Please enter a name or photo URL to update.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${FIREBASE_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            idToken: authCtx.token,
            displayName: fullName || undefined,
            photoUrl: photoUrl || undefined,
            returnSecureToken: true,
          }),
        }
      );

      const data = await response.json();
      setIsLoading(false);

      if (!response.ok) {
        console.error("Firebase Error Response:", data);
        throw new Error(data.error?.message || "Profile update failed");
      }

      console.log("✅ Profile updated successfully:", data);
      alert("Profile updated successfully!");
      setIsUpdating(false);
    } catch (err) {
      setIsLoading(false);
      console.error("Error updating profile:", err);
      alert("Error updating profile: " + err.message);
    }
  };

  const cancelHandler = () => {
    setIsUpdating(false);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Update Profile</h2>
      <div style={styles.formControl}>
        <label style={styles.label}>Full Name</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Enter your full name"
          style={styles.input}
        />
      </div>
      <div style={styles.formControl}>
        <label style={styles.label}>Photo URL</label>
        <input
          type="text"
          value={photoUrl}
          onChange={(e) => setPhotoUrl(e.target.value)}
          placeholder="Enter your photo URL"
          style={styles.input}
        />
      </div>
      <div style={styles.actions}>
        <button onClick={updateHandler} style={styles.updateBtn} disabled={isLoading}>
          {isLoading ? "Updating..." : "Update"}
        </button>
        <button onClick={cancelHandler} style={styles.cancelBtn}>
          Cancel
        </button>
      </div>
    </div>
  );
};

// (Styles remain the same as your previous version)
const styles = {
  container: {
    maxWidth: "400px",
    margin: "1rem auto",
    padding: "2rem",
    borderRadius: "8px",
    backgroundColor: "#f4f0fa",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  title: {
    marginBottom: "1.5rem",
    color: "#6200ee",
  },
  formControl: {
    marginBottom: "1rem",
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
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  actions: {
    marginTop: "1.5rem",
    display: "flex",
    justifyContent: "space-between",
  },
  updateBtn: {
    flex: 1,
    padding: "0.5rem 1rem",
    marginRight: "0.5rem",
    backgroundColor: "#6200ee",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  cancelBtn: {
    flex: 1,
    padding: "0.5rem 1rem",
    marginLeft: "0.5rem",
    backgroundColor: "#ccc",
    color: "#333",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default UpdateProfile;