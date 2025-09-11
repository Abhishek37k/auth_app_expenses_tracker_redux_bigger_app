import { Routes, Route } from "react-router-dom";
import AuthForm from "./components/AuthForm";
import store from "../src/components/store/index"; 
import Home from "./components/pages/Home";
import Navbar from "./components/layout/Navbar";
import { Provider } from "react-redux";
import Welcome from "./components/pages/Welcome";
import ForgetPassword from "./components/pages/ForgetPassword";
import Expenses from "./components/expenses/Expenses";
function App() {
  return (
   <Provider store={store}>
      <Navbar />
      <Routes>
        {" "}
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/auth" element={<AuthForm />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="*" element={<Home />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Provider>
  );
}

export default App;
