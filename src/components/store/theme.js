import { createSlice } from "@reduxjs/toolkit";

const initialThemeState = {
  darkMode: false,
};

const themeSlice = createSlice({
  name: "theme",
  initialState: initialThemeState,
  reducers: {
    toggleTheme(state) {
      state.darkMode = !state.darkMode;
    },
  },
});

export const themeActions = themeSlice.actions;
export default themeSlice.reducer;
