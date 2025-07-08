import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "../components/AuthPage";
import Homepage from "./components/Homepage";
import toast, { Toaster } from "react-hot-toast";

export default function App() {
  // Load token from localStorage directly
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  useEffect(() => {
    // Sync state on mount in case of refresh
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
          <Route path="/login" element={<AuthPage isLogin={true} />} />
          <Route path="/register" element={<AuthPage isLogin={false} />} />
          <Route
            path="/"
            element={
              token ? <Homepage /> : <Navigate to="/login" />
            }
          />
        </Routes>
      </Router>
    </>
  );
}
