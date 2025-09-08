import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import expenseReducer from "../store/expense";
import themeReducer from "../store/theme";
import authReducer from "../store/auth";
import Expenses from "../expenses/Expenses";

// Helper to render with real Redux store
function renderWithStore(preloadedState) {
  const store = configureStore({
    reducer: {
      expense: expenseReducer,
      theme: themeReducer,
      auth: authReducer,
    },
    preloadedState,
  });

  return render(
    <Provider store={store}>
      <Expenses />
    </Provider>
  );
}

describe("Expenses Component (Fresher level tests)", () => {
  // 1
  test("renders heading", () => {
    renderWithStore({
      auth: { token: "x", userId: "u1", isLoggedIn: true },
      expense: { expenses: [] },
      theme: { darkMode: false },
    });
    expect(screen.getByText(/Daily Expenses Tracker/i)).toBeInTheDocument();
  });

  // 2
  test("renders inputs and add button", () => {
    renderWithStore({
      auth: { token: "x", userId: "u1", isLoggedIn: true },
      expense: { expenses: [] },
      theme: { darkMode: false },
    });

    expect(screen.getByPlaceholderText(/Money Spent/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Description/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Add Expense/i })).toBeInTheDocument();
  });

  // 3
  test("shows message when no expenses", () => {
    renderWithStore({
      auth: { token: "x", userId: "u1", isLoggedIn: true },
      expense: { expenses: [] },
      theme: { darkMode: false },
    });

    expect(screen.getByText(/No expenses added yet./i)).toBeInTheDocument();
  });

  // 4
  test("shows login message when user not logged in", () => {
    renderWithStore({
      auth: { token: null, userId: null, isLoggedIn: false },
      expense: { expenses: [] },
      theme: { darkMode: false },
    });

    expect(screen.getByText(/Please login to add expenses/i)).toBeInTheDocument();
  });

  // 5
  test("renders existing expense item", () => {
    renderWithStore({
      auth: { token: "x", userId: "u1", isLoggedIn: true },
      expense: {
        expenses: [{ id: "1", money: "200", description: "Snacks", category: "Food" }],
      },
      theme: { darkMode: false },
    });

    expect(screen.getByText(/Snacks/i)).toBeInTheDocument();
    expect(screen.getByText(/₹200/i)).toBeInTheDocument();
  });

  // 6
  test("edit and delete buttons are visible for an expense", () => {
    renderWithStore({
      auth: { token: "x", userId: "u1", isLoggedIn: true },
      expense: {
        expenses: [{ id: "1", money: "200", description: "Book", category: "Other" }],
      },
      theme: { darkMode: false },
    });

    expect(screen.getByRole("button", { name: /Edit/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Delete/i })).toBeInTheDocument();
  });

  // 7
  test("form fields update when typing", () => {
    renderWithStore({
      auth: { token: "x", userId: "u1", isLoggedIn: true },
      expense: { expenses: [] },
      theme: { darkMode: false },
    });

    const moneyInput = screen.getByPlaceholderText(/Money Spent/i);
    const descInput = screen.getByPlaceholderText(/Description/i);

    fireEvent.change(moneyInput, { target: { value: "500" } });
    fireEvent.change(descInput, { target: { value: "Fuel" } });

    expect(moneyInput.value).toBe("500");
    expect(descInput.value).toBe("Fuel");
  });

  // 8
  test("button text changes to Update Expense in edit mode", () => {
    renderWithStore({
      auth: { token: "x", userId: "u1", isLoggedIn: true },
      expense: {
        expenses: [{ id: "1", money: "300", description: "Movie", category: "Entertainment" }],
      },
      theme: { darkMode: false },
    });

    fireEvent.click(screen.getByRole("button", { name: /Edit/i }));
    expect(screen.getByRole("button", { name: /Update Expense/i })).toBeInTheDocument();
  });

  // 9
  test("shows premium buttons when expenses exceed 10000", () => {
    renderWithStore({
      auth: { token: "x", userId: "u1", isLoggedIn: true },
      expense: {
        expenses: [{ id: "1", money: "15000", description: "Laptop", category: "Other" }],
      },
      theme: { darkMode: false },
    });

    expect(screen.getByRole("button", { name: /Activate Premium/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Download Expenses/i })).toBeInTheDocument();
  });

  // 10
  test("dark mode changes button text", () => {
    renderWithStore({
      auth: { token: "x", userId: "u1", isLoggedIn: true },
      expense: {
        expenses: [{ id: "1", money: "20000", description: "Bike", category: "Other" }],
      },
      theme: { darkMode: true },
    });

    expect(screen.getByRole("button", { name: /Switch to Light Mode/i })).toBeInTheDocument();
  });
});
