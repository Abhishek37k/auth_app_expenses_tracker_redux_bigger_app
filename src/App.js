import { Routes, Route } from "react-router-dom";
import AuthForm from "./components/AuthForm";
import { AuthContextProvider } from "./components/store/auth-context";
import Home from "./components/pages/Home";

function App() {
  return (
    <AuthContextProvider>
       <Routes>
        {/* Home page */}
        <Route path="/" element={<Home />} />

        {/* Auth page */}
        <Route path="/auth" element={<AuthForm />} />

        {/* Optional: catch-all for invalid routes */}
        <Route path="*" element={<Home />} />
      </Routes>
    </AuthContextProvider>
  );
}

export default App;
