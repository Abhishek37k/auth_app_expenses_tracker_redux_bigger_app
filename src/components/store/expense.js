import { createSlice } from "@reduxjs/toolkit";

const expenseInitialState = {
  expenses: [],
};

const expenseSlice = createSlice({
  name: "expense",
  initialState: expenseInitialState,
  reducers: {
    setExpenses(state, action) {
      state.expenses = action.payload;
    },
    addExpense(state, action) {
      state.expenses.unshift(action.payload);
    },
    updateExpense(state, action) {
      const updated = action.payload;
      state.expenses = state.expenses.map((exp) =>
        exp.id === updated.id ? updated : exp
      );
    },
    deleteExpense(state, action) {
      const id = action.payload;
      state.expenses = state.expenses.filter((exp) => exp.id !== id);
    },
  },
});

export const expenseActions = expenseSlice.actions;
export default expenseSlice.reducer;
