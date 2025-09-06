import { createSlice } from "@reduxjs/toolkit";
const initialToken = localStorage.getItem("token");
const initialUserId = localStorage.getItem("userId");

const authslice = createSlice({
  name: "auth",
  initialState: {
    token: initialToken || null,
    userId: initialUserId || null,
    isLoggedIn: !!initialToken,
  },

  reducers: {
    login(state, action) {
      state.token = action.payload.token;
      state.userId = action.payload.userId;
      state.isLoggedIn = true;
    },
    signup(state, action) {
      state.token = action.payload.token;
      state.userId = action.payload.userId;
      state.isLoggedIn = true;
    },
    logout(state) {
      state.isLoggedIn = false;
    }
  }
});

export const authActions = authslice.actions;
export default authslice.reducer;
