import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthPage = ({ isLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      alert("Please enter both username and password.");
      return;
    }

    setLoading(true);
    try {
      const API_URL = "https://passvault-4blr.onrender.com";
      const url = isLogin ? "/api/auth/login" : "/api/auth/register";

      const res = await axios.post(`${API_URL}${url}`, { username, password });

      if (isLogin && res.data.token) {
        localStorage.setItem("token", res.data.token);
        navigate("/");
        window.location.reload();
      } else {
        alert("Registration successful! Please log in.");
        navigate("/login");
      }
    } catch (err) {
      const message =
        err.response?.data?.message || (isLogin ? "Login failed" : "Registration failed");
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-gray-800/60 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-gray-700"
      >
        <h2 className="text-3xl font-extrabold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          {isLogin ? "Welcome To <PassVault> 👋"  : "Create an Account"}
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Username</label>
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>

        <button
          type="submit"
          className={`w-full py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 transition-all duration-300 ${
            loading ? "opacity-60 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? (isLogin ? "Logging in..." : "Registering...") : isLogin ? "Login" : "Register"}
        </button>

        <p className="mt-4 text-center text-sm text-gray-300">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button
            type="button"
            onClick={() => navigate(isLogin ? "/register" : "/login")}
            className="ml-2 text-blue-400 hover:underline"
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
      </form>
    </div>
  );
};

export default AuthPage;
