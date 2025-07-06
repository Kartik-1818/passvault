import { useCallback, useState, useEffect, useMemo } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "../components/AuthPage";
import Homepage from "./components/Homepage";
import { Navigate } from "react-router-dom";

export default function App() {
  
  return (
    <Router>
  <Routes>
    <Route path="/login" element={<AuthPage isLogin={true} />} />
    <Route path="/register" element={<AuthPage isLogin={false} />} />
    <Route path="/" 
      element={
    localStorage.getItem("token") ? (
      <Homepage />
    ) : (
      <Navigate to="/login" />
    )
  }
     />
  </Routes>
</Router>

  );
}


