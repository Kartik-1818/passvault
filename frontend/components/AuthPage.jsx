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
      window.location.reload(); // Reload user-specific data
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
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-sm"
      >
        <h2 className="text-2xl mb-4">{isLogin ? "Login" : "Register"}</h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 mb-3 rounded bg-gray-700"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-3 rounded bg-gray-700"
          required
        />

        <button
          type="submit"
          className={`w-full py-2 bg-blue-600 hover:bg-blue-700 rounded ${
            loading ? "opacity-75 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading
            ? isLogin
              ? "Logging in..."
              : "Registering..."
            : isLogin
            ? "Login"
            : "Register"}
        </button>

        <p className="mt-3 text-sm">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <a
            href="#"
            onClick={() => navigate(isLogin ? "/register" : "/login")}
            className="text-blue-400 ml-1"
          >
            {isLogin ? "Register" : "Login"}
          </a>
        </p>
      </form>
    </div>
  );
};

export default AuthPage;
