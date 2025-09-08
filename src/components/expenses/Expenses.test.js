import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import expenseReducer from "../store/expense";
import themeReducer from "../store/theme";
import authReducer from "../store/auth";
import Expenses from "./Expenses";


global.URL.createObjectURL = jest.fn();
global.URL.revokeObjectURL = jest.fn();


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

beforeAll(() => {
  global.URL.createObjectURL = jest.fn(() => "mock-url");
    global.URL.revokeObjectURL = jest.fn();
});

// ✅ Mock fetch globally before tests
beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve([]), // default mock response
    })
  );
});

afterEach(() => {
  jest.clearAllMocks();
});

// Helper to render with Redux store


/* -------------------------------------------------------------------------- */

describe("Expenses Component (Fresher level tests)", () => {
  test("renders login message if not logged in", () => {
    renderWithStore({ auth: { isLoggedIn: false } });
    expect(
      screen.getByText(/Please login to add expenses/i)
    ).toBeInTheDocument();
  });

  test("renders expense form when logged in", () => {
    renderWithStore({ auth: { isLoggedIn: true, token: "abc", userId: "u1" } });
    expect(screen.getByPlaceholderText(/Money Spent/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Description/i)).toBeInTheDocument();
  });

  test("can type into money input", () => {
    renderWithStore({ auth: { isLoggedIn: true, token: "abc", userId: "u1" } });
    const input = screen.getByPlaceholderText(/Money Spent/i);
    fireEvent.change(input, { target: { value: "500" } });
    expect(input.value).toBe("500");
  });

  test("can type into description input", () => {
    renderWithStore({ auth: { isLoggedIn: true, token: "abc", userId: "u1" } });
    const input = screen.getByPlaceholderText(/Description/i);
    fireEvent.change(input, { target: { value: "Pizza" } });
    expect(input.value).toBe("Pizza");
  });

  test("shows no expenses initially", () => {
    renderWithStore({
      auth: { isLoggedIn: true, token: "abc", userId: "u1" },
      expense: { expenses: [] },
    });
    expect(screen.getByText(/No expenses added yet/i)).toBeInTheDocument();
  });

  test("renders existing expenses from store", () => {
    renderWithStore({
      auth: { isLoggedIn: true, token: "abc", userId: "u1" },
      expense: {
        expenses: [{ id: "e1", money: "200", description: "Tea", category: "Food" }],
      },
    });
    expect(screen.getByText(/Tea/i)).toBeInTheDocument();
    expect(screen.getByText(/₹200/i)).toBeInTheDocument();
  });

  test("add expense button is visible", () => {
    renderWithStore({ auth: { isLoggedIn: true, token: "abc", userId: "u1" } });
    expect(screen.getByRole("button", { name: /Add Expense/i })).toBeInTheDocument();
  });

  test("edit button is rendered with expenses", () => {
    renderWithStore({
      auth: { isLoggedIn: true, token: "abc", userId: "u1" },
      expense: {
        expenses: [{ id: "e1", money: "100", description: "Bus", category: "Other" }],
      },
    });
    expect(screen.getByText(/Edit/i)).toBeInTheDocument();
  });

  test("delete button is rendered with expenses", () => {
    renderWithStore({
      auth: { isLoggedIn: true, token: "abc", userId: "u1" },
      expense: {
        expenses: [{ id: "e2", money: "400", description: "Movie", category: "Entertainment" }],
      },
    });
    expect(screen.getByText(/Delete/i)).toBeInTheDocument();
  });

  test("premium buttons appear if total expense > 10000", () => {
    renderWithStore({
      auth: { isLoggedIn: true, token: "abc", userId: "u1" },
      expense: {
        expenses: [{ id: "e3", money: "20000", description: "Laptop", category: "Other" }],
      },
    });
    expect(screen.getByRole("button", { name: /Activate Premium/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Download Expenses/i })).toBeInTheDocument();
  });
});

/* -------------------------------------------------------------------------- */

describe("Expenses Component (API interaction tests)", () => {
  const baseState = {
    auth: { isLoggedIn: true, token: "abc", userId: "u1" },
    expense: { expenses: [] },
  };

  test("fetches expenses on mount", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ e1: { money: "100", description: "Tea", category: "Food" } }),
    });

    renderWithStore(baseState);

    await waitFor(() => {
      expect(screen.getByText(/Tea/i)).toBeInTheDocument();
    });
  });

  test("handles fetch error gracefully", async () => {
    fetch.mockResolvedValueOnce({ ok: false });

    renderWithStore(baseState);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });
  });

  test("adds new expense via POST", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ name: "newId" }),
    });

    renderWithStore(baseState);

    fireEvent.change(screen.getByPlaceholderText(/Money Spent/i), {
      target: { value: "300" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Description/i), {
      target: { value: "Coffee" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Add Expense/i }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/expenses/u1.json?auth=abc"),
        expect.objectContaining({ method: "POST" })
      );
    });
  });

  test("updates existing expense via PUT", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    renderWithStore({
      ...baseState,
      expense: { expenses: [{ id: "e1", money: "100", description: "Bus", category: "Other" }] },
    });

    fireEvent.click(screen.getByText(/Edit/i));

    fireEvent.change(screen.getByPlaceholderText(/Money Spent/i), {
      target: { value: "150" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Update Expense/i }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/expenses/u1/e1.json?auth=abc"),
        expect.objectContaining({ method: "PUT" })
      );
    });
  });

  test("deletes an expense via DELETE", async () => {
    fetch.mockResolvedValueOnce({ ok: true });

    renderWithStore({
      ...baseState,
      expense: { expenses: [{ id: "e2", money: "200", description: "Snack", category: "Food" }] },
    });

    fireEvent.click(screen.getByText(/Delete/i));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/expenses/u1/e2.json?auth=abc"),
        expect.objectContaining({ method: "DELETE" })
      );
    });
  });

  test("reset form clears input fields", async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({}) });

    renderWithStore(baseState);

    fireEvent.change(screen.getByPlaceholderText(/Money Spent/i), {
      target: { value: "500" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Description/i), {
      target: { value: "Chips" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Add Expense/i }));

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Money Spent/i).value).toBe("");
      expect(screen.getByPlaceholderText(/Description/i).value).toBe("");
    });
  });

  test("shows cancel button when editing", async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({}) });

    renderWithStore({
      ...baseState,
      expense: { expenses: [{ id: "e3", money: "700", description: "Shoes", category: "Other" }] },
    });

    fireEvent.click(screen.getByText(/Edit/i));

    expect(screen.getByRole("button", { name: /Cancel/i })).toBeInTheDocument();
  });

  test("toggles theme when premium button clicked", async () => {
    renderWithStore({
      ...baseState,
      expense: { expenses: [{ id: "e4", money: "15000", description: "Phone", category: "Other" }] },
    });

    const btn = screen.getByRole("button", { name: /Activate Premium/i });
    fireEvent.click(btn);

    expect(btn).toBeInTheDocument();
  });

  test("download expenses button is clickable", async () => {
    renderWithStore({
      ...baseState,
      expense: { expenses: [{ id: "e5", money: "12000", description: "Bike", category: "Other" }] },
    });

    const btn = screen.getByRole("button", { name: /Download Expenses/i });
    fireEvent.click(btn);

    expect(btn).toBeInTheDocument();
  });

test("form inputs are rendered correctly", () => {
  renderWithStore(baseState);

  expect(screen.getByPlaceholderText(/Money Spent/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/Description/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /Add Expense/i })).toBeInTheDocument();
});
});
