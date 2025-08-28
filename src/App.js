import { Routes, Route } from "react-router-dom";
import AuthForm from "./components/AuthForm";
import { AuthContextProvider } from "./components/store/auth-context";
import Home from "./components/pages/Home";
import Navbar from "./components/layout/Navbar";
import Welcome from "./components/pages/Welcome";
import ForgetPassword from "./components/pages/ForgetPassword";

function App() {
  return (
    <AuthContextProvider>
      <Navbar />
      <Routes>
        {" "}
        <Route path="/forgot-password" element={<ForgetPassword />} />
        {/* Home page */}
        {/* Auth page */}
        <Route path="/auth" element={<AuthForm />} />
        <Route path="/welcome" element={<Welcome />} />
        {/* Optional: catch-all for invalid routes */}
        <Route path="*" element={<Home />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </AuthContextProvider>
  );
}

export default App;
