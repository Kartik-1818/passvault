import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "../components/AuthPage";
import Homepage from "./components/Homepage";
import toast, { Toaster } from "react-hot-toast";

export default function App() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

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
