import { createSlice } from "@reduxjs/toolkit";

const expenseInitialState = {
  expenses: [],
};

const expenseSlice = createSlice({
  name: "expense",
  initialState: expenseInitialState,
  reducers: {
    setExpenses(state, action) {
      // Replace entire list (after fetching from backend)
      state.expenses = action.payload;
    },
    addExpense(state, action) {
      // Add a new expense
      state.expenses.unshift(action.payload);
    },
    updateExpense(state, action) {
      // Update an existing expense
      const updated = action.payload;
      state.expenses = state.expenses.map((exp) =>
        exp.id === updated.id ? updated : exp
      );
    },
    deleteExpense(state, action) {
      // Remove an expense by id
      const id = action.payload;
      state.expenses = state.expenses.filter((exp) => exp.id !== id);
    },
  },
});

export const expenseActions = expenseSlice.actions;
export default expenseSlice.reducer;
