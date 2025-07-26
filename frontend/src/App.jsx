import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "../components/AuthPage";
import Homepage from "./components/Homepage";
import toast, { Toaster } from "react-hot-toast";

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken && !token) {
      setToken(savedToken);
    }
  }, [token]);

  return (
    <>
      <Toaster position="top-center" />
      <Router>
        <Routes>
          <Route
            path="/login"
            element={<AuthPage isLogin={true} setToken={setToken} />}
          />
          <Route
            path="/register"
            element={<AuthPage isLogin={false} setToken={setToken} />}
          />
          <Route
            path="/"
            element={token ? <Homepage setToken={setToken} /> : <Navigate to="/login" />}
          />
        </Routes>
      </Router>
    </>
  );
}
